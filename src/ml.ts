/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 * Modifications (c) 2024, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import * as tf from "@tensorflow/tfjs";
import { SymbolicTensor } from "@tensorflow/tfjs";
import { Filter, getMlFilters, mlSettings } from "./mlConfig";
import { ActionData, RecordingData, XYZData } from "./model";
import { DataWindow } from "./store";

export type TrainingResult =
  | {
      error: false;
      model: tf.LayersModel;
      testIds: number[];
    }
  | { error: true };

export type TestResult = { error: false; accuracy: number } | { error: true };

interface TrainModelOpts {
  enabledFeatures?: Set<Filter>;
  onProgress?: (progress: number) => void;
  testTrainSplit?: number;
}

export const trainModel = async (
  data: ActionData[],
  dataWindow: DataWindow,
  opts: TrainModelOpts = {
    enabledFeatures: mlSettings.includedFilters,
    testTrainSplit: 0,
  }
): Promise<TrainingResult> => {
  // Get test training split
  const { trainIds, testIds } = splitData(data, opts.testTrainSplit);

  // get the recording data for the training set.
  const trainingData = getDataFromIDs(data, trainIds);

  // Gets a set of 24 values for each recording. Each set of features is labelled with a one-hot encoding
  const { features, labels } = prepareFeaturesAndLabels(
    trainingData,
    dataWindow,
    opts.enabledFeatures
  );

  const model: tf.LayersModel = createModel(data, opts.enabledFeatures);
  const totalNumEpochs = mlSettings.numEpochs;

  try {
    await model.fit(tf.tensor(features), tf.tensor(labels), {
      epochs: totalNumEpochs,
      batchSize: 16,
      shuffle: true,
      // We don't do anything with the validation data, so might
      // as well train using all of it.
      validationSplit: 0,
      callbacks: {
        onEpochEnd: (epoch: number) => {
          // Epochs indexed at 0
          opts.onProgress && opts.onProgress(epoch / (totalNumEpochs - 1));
        },
      },
    });
  } catch (err) {
    return { error: true };
  }

  if (testIds.length === 0) {
    return { error: false, model, testIds: [] };
  }

  return { error: false, model, testIds };
};

export const testModel = (
  model: tf.LayersModel,
  test_features: number[][],
  test_labels: number[][]
): TestResult => {
  const numActions = test_labels[0].length;
  let accuracy: number = 0;

  const prediction = model.predict(tf.tensor(test_features)) as tf.Tensor;
  try {
    const confidences = prediction.dataSync() as Float32Array;

    for (let i = 0; i < confidences.length; i += numActions) {
      const sample: number[] = [].slice.call(
        confidences.slice(i, i + numActions)
      );

      const prediction = sample.indexOf(Math.max(...sample));
      const truth = test_labels[i / numActions].indexOf(1);

      if (prediction === truth) {
        accuracy++;
      }
    }
    accuracy = accuracy / test_features.length;

    return {
      error: false,
      accuracy: accuracy,
    };
  } catch (e) {
    return { error: true };
  }
};

// Exported for testing
export const splitData = (
  actions: ActionData[],
  testSize: number = 0.2
): { trainIds: number[]; testIds: number[] } => {
  // Want to keep the number of actions in each class in the testing and training set relative
  // We need to sort into classes and then split each class separately
  const testSampleIds: number[] = [];
  const trainSampleIds: number[] = [];

  actions.forEach((action) => {
    // how many samples should be in the test set
    const testLength = Math.round(action.recordings.length * testSize);

    // get random indices
    let indices = Array.from({ length: action.recordings.length }, (_, i) => i);
    for (let i = 0; i < testLength; i++) {
      const randIndex =
        i + Math.floor(Math.random() * (action.recordings.length - i));
      [indices[i], indices[randIndex]] = [indices[randIndex], indices[i]];
    }
    indices = indices.slice(0, testLength);

    // get the recording ids of each sample to be in the test set
    action.recordings.forEach((recording, idx) => {
      if (indices.includes(idx)) {
        // add sample ID
        testSampleIds.push(recording.ID);
      } else {
        // add feature
        trainSampleIds.push(recording.ID);
      }
    });
  });

  return { trainIds: trainSampleIds, testIds: testSampleIds };
};

const getDataFromIDs = (data: ActionData[], ids: number[]) => {
  const filteredData: ActionData[] = [];

  data.forEach((action) => {
    const actionData: RecordingData[] = [];

    action.recordings.forEach((recording) => {
      if (ids.includes(recording.ID)) {
        actionData.push(recording);
      }
    });

    filteredData.push({
      recordings: actionData,
      name: action.name,
      ID: action.ID,
      icon: action.icon,
      requiredConfidence: action.requiredConfidence,
    });
  });

  return filteredData;
};

// Exported for testing
export const prepareFeaturesAndLabels = (
  actions: ActionData[],
  dataWindow: DataWindow,
  enabledFeatures: Set<Filter> = mlSettings.includedFilters
): { features: number[][]; labels: number[][] } => {
  const features: number[][] = [];
  const labels: number[][] = [];
  const numActions = actions.length;

  actions.forEach((action, index) => {
    action.recordings.forEach((recording) => {
      // Prepare features
      features.push(
        Object.values(
          applyFilters(recording.data, dataWindow, {
            enabledFilters: enabledFeatures,
          })
        )
      );

      // Prepare labels
      const label: number[] = new Array(numActions) as number[];
      label.fill(0, 0, numActions);
      label[index] = 1;
      labels.push(label);
    });
  });
  return { features, labels };
};

// DATA AUGMENTATION
// add jitter to data in order to create an augmented dataset
export const addJitter = (
  action: ActionData,
  repeats: number = 1,
  mean: number = 0,
  stddev: number = 1.0,
  includeOriginal: boolean = false
) => {
  const recordings: RecordingData[] = [];
  let recordingID = Date.now();

  const normalNoise = (mean: number, stddev: number) => {
    const u1 = Math.random();
    const u2 = Math.random();

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    return z0 * stddev + mean;
  };

  action.recordings.forEach((recording) => {
    // for the number of repeats requested
    for (let i = 0; i < repeats; i++) {
      // for each of the recordings add random noise to each axis
      const noisy_x = recording.data.x.map(
        (value) => normalNoise(mean, stddev) + value
      );
      const noisy_y = recording.data.y.map(
        (value) => normalNoise(mean, stddev) + value
      );
      const noisy_z = recording.data.z.map(
        (value) => normalNoise(mean, stddev) + value
      );

      // add a new recording to the recordings array
      const newRecording: XYZData = { x: noisy_x, y: noisy_y, z: noisy_z };
      recordings.push({
        ID: recordingID,
        data: newRecording,
        isGenerated: true,
      });
      recordingID++;
    }
  });

  if (includeOriginal) {
    recordings.push(...action.recordings);
  }

  return recordings;
};

const createModel = (
  actions: ActionData[],
  filters: Set<Filter> = mlSettings.includedFilters
): tf.LayersModel => {
  const numberOfClasses: number = actions.length;
  const inputShape = [filters.size * mlSettings.includedAxes.length];

  const input = tf.input({ shape: inputShape });
  const normalizer = tf.layers.batchNormalization().apply(input);
  const dense = tf.layers
    .dense({ units: 16, activation: "relu" })
    .apply(normalizer);
  const softmax = tf.layers
    .dense({ units: numberOfClasses, activation: "softmax" })
    .apply(dense) as SymbolicTensor;
  const model = tf.model({ inputs: input, outputs: softmax });

  model.compile({
    loss: "categoricalCrossentropy",
    optimizer: tf.train.sgd(mlSettings.learningRate),
    metrics: ["accuracy"],
  });

  return model;
};

export const normalize = (value: number, min: number, max: number) => {
  const newMin = 0;
  const newMax = 1;
  return ((newMax - newMin) * (value - min)) / (max - min) + newMin;
};

// Used for training model and producing fingerprints
// applyFilters reduces array of x, y and z inputs to a single number array with values.
export const applyFilters = (
  data: XYZData,
  dataWindow: DataWindow,
  opts: { normalize?: boolean; enabledFilters?: Set<Filter> } = {}
): Record<string, number> => {
  if (data.x.length === 0 || data.y.length === 0 || data.z.length === 0) {
    throw new Error("Empty x/y/z data");
  }

  opts.enabledFilters =
    opts.enabledFilters === undefined
      ? mlSettings.includedFilters
      : opts.enabledFilters;

  return Array.from(opts.enabledFilters).reduce((acc, filter) => {
    const { x, y, z } = applyFilter(filter, data, dataWindow, {
      normalize: opts.normalize,
    });

    return {
      ...acc,
      [`${filter}-x`]: x,
      [`${filter}-y`]: y,
      [`${filter}-z`]: z,
    };
  }, {} as Record<string, number>);
};

export const applyFilter = (
  filter: Filter,
  { x, y, z }: XYZData,
  dataWindow: DataWindow,
  opts: { normalize?: boolean } = {}
): Record<string, number> => {
  if (x.length === 0 || y.length === 0 || z.length === 0) {
    throw new Error("Empty x/y/z data");
  }

  const filters = getMlFilters(dataWindow);
  const { strategy, min, max } = filters[filter];

  const applyFilterOnDimension = (vs: number[]) =>
    opts.normalize
      ? normalize(strategy(vs, dataWindow), min, max)
      : strategy(vs, dataWindow);
  return {
    x: applyFilterOnDimension(x),
    y: applyFilterOnDimension(y),
    z: applyFilterOnDimension(z),
  };
};

interface PredictInput {
  model: tf.LayersModel;
  data: XYZData;
  classificationIds: number[];
}

export type Confidences = Record<ActionData["ID"], number>;

export type ConfidencesResult =
  | { error: true; detail: unknown }
  | { error: false; confidences: Confidences };

// For predicting
export const predict = (
  { model, data, classificationIds }: PredictInput,
  dataWindow: DataWindow
): ConfidencesResult => {
  const input = Object.values(applyFilters(data, dataWindow));
  const prediction = model.predict(tf.tensor([input])) as tf.Tensor;
  try {
    const confidences = prediction.dataSync() as Float32Array;
    return {
      error: false,
      confidences: classificationIds.reduce(
        (acc, id, idx) => ({ ...acc, [id]: confidences[idx] }),
        {}
      ),
    };
  } catch (e) {
    return { error: true, detail: e };
  }
};
