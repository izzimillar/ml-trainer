/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 * Modifications (c) 2024, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import {
  ChartConfiguration,
  ChartTypeRegistry,
  ScriptableContext,
  ScriptableLineSegmentContext,
} from "chart.js";
import { GraphLineStyles } from "./hooks/use-graph-line-styles";
import { Filter, maxAccelerationScaleForGraphs } from "./mlConfig";
import { XYZData } from "./model";
import { GraphLineWeight } from "./settings";

const smoothen = (d: number[]): number[] => {
  if (d.length === 0) {
    return d;
  }

  const newData: number[] = [];
  let prevValue = d[0];
  d.forEach((v) => {
    const newValue = v * 0.25 + prevValue * 0.75;
    newData.push(newValue);
    prevValue = newValue;
  });
  return newData;
};

// Smoothen data
export function smoothenXYZData(d: XYZData): XYZData {
  return {
    x: smoothen(d.x),
    y: smoothen(d.y),
    z: smoothen(d.z),
  };
}

interface Pos {
  x: number;
  y: number;
}

const processDimensionData = (data: number[]) => {
  const formatToChartPos = (y: number, idx: number) => ({ x: idx, y });
  return smoothen(data).map(formatToChartPos);
};

interface GraphColors {
  x: string;
  y: string;
  z: string;
}

const toTransparent = (colour: string, value: number) => {
  const trans = `${colour.slice(0, colour.length - 2)}, ${value})`;
  return trans;
};

export const getConfig = (
  { x: rawX, y: rawY, z: rawZ }: XYZData,
  responsive: boolean,
  colors: GraphColors,
  lineStyles: GraphLineStyles,
  graphLineWeight: GraphLineWeight,
  filters: Set<Filter> = new Set<Filter>(),
  showLines: boolean = true,
  featureView: boolean = false
): ChartConfiguration<keyof ChartTypeRegistry, Pos[], string> => {
  const x = processDimensionData(rawX);
  const y = processDimensionData(rawY);
  const z = processDimensionData(rawZ);

  const transparency = 0.3;
  const common = {
    borderWidth: graphLineWeight === "default" ? 1 : 2,
    pointRadius: 0,
    pointHoverRadius: 0,
  };
  return {
    type: "line",
    data: {
      datasets: [
        {
          ...common,
          label: "x",
          borderColor: colors.x,
          borderDash: lineStyles.x ?? [],
          backgroundColor: toTransparent(colors.x, transparency),
          data: x,
          segment: {
            borderWidth: (ctx) => highlightSegments(ctx, x, filters),
            borderColor: (ctx) =>
              colourSegments(ctx, x, filters, colors.x, showLines),
          },
          borderCapStyle: "round",
          pointRadius: (ctx: ScriptableContext<"line">) =>
            highlightPoints(ctx, filters),
          fill: filters.has(Filter.ACC) ? "origin" : "none",
          showLine: shouldShowLine(showLines, filters),
        },
        {
          ...common,
          label: "y",
          borderColor: colors.y,
          borderDash: lineStyles.y ?? [],
          backgroundColor: toTransparent(colors.y, transparency),
          data: y,
          segment: {
            borderWidth: (ctx) => highlightSegments(ctx, y, filters),
            borderColor: (ctx) =>
              colourSegments(ctx, y, filters, colors.y, showLines),
          },
          borderCapStyle: "round",
          pointRadius: (ctx: ScriptableContext<"line">) =>
            highlightPoints(ctx, filters),
          fill: filters.has(Filter.ACC) ? "origin" : "none",
          showLine: shouldShowLine(showLines, filters),
        },
        {
          ...common,
          label: "z",
          borderColor: colors.z,
          borderDash: lineStyles.z ?? [],
          backgroundColor: toTransparent(colors.z, transparency),
          data: z,
          segment: {
            borderWidth: (ctx) => highlightSegments(ctx, z, filters),
            borderColor: (ctx) =>
              colourSegments(ctx, z, filters, colors.z, showLines),
          },
          borderCapStyle: "round",
          pointRadius: (ctx: ScriptableContext<"line">) =>
            highlightPoints(ctx, filters),
          fill: filters.has(Filter.ACC) ? "origin" : "none",
          showLine: shouldShowLine(showLines, filters),
        },
        // MEAN
        {
          ...common,
          label: "mean-x",
          borderColor: colors.x,
          borderDash: lineStyles.x ?? [],
          data: getMean(x),
          hidden: !filters.has(Filter.MEAN),
        },
        {
          ...common,
          label: "mean-y",
          borderColor: colors.y,
          borderDash: lineStyles.y ?? [],
          data: getMean(y),
          hidden: !filters.has(Filter.MEAN),
        },
        {
          ...common,
          label: "mean-z",
          borderColor: colors.z,
          borderDash: lineStyles.z ?? [],
          data: getMean(z),
          hidden: !filters.has(Filter.MEAN),
        },
        // STD DEV
        {
          ...common,
          label: "pos-stddev-x",
          borderColor: colors.x,
          borderDash: lineStyles.x ?? [],
          data: getStdDev(x, true),
          hidden: !filters.has(Filter.STD),
        },
        {
          ...common,
          label: "neg-stddev-x",
          borderColor: colors.x,
          borderDash: lineStyles.x ?? [],
          data: getStdDev(x, false),
          hidden: !filters.has(Filter.STD),
          backgroundColor: toTransparent(colors.x, transparency),
          fill: "-1",
        },
        {
          ...common,
          label: "pos-stddev-y",
          borderColor: colors.y,
          borderDash: lineStyles.y ?? [],
          data: getStdDev(y, true),
          hidden: !filters.has(Filter.STD),
        },
        {
          ...common,
          label: "neg-stddev-y",
          borderColor: colors.y,
          borderDash: lineStyles.y ?? [],
          data: getStdDev(y, false),
          hidden: !filters.has(Filter.STD),
          backgroundColor: toTransparent(colors.y, transparency),
          fill: "-1",
        },
        {
          ...common,
          label: "pos-stddev-z",
          borderColor: colors.z,
          borderDash: lineStyles.z ?? [],
          data: getStdDev(z, true),
          hidden: !filters.has(Filter.STD),
        },
        {
          ...common,
          label: "neg-stddev-z",
          borderColor: colors.z,
          borderDash: lineStyles.z ?? [],
          data: getStdDev(z, false),
          hidden: !filters.has(Filter.STD),
          backgroundColor: toTransparent(colors.z, transparency),
          fill: "-1",
        },
        // RMS
        {
          ...common,
          label: "rms-x",
          borderColor: colors.x,
          borderDash: lineStyles.x ?? [],
          data: getRootMeanSquare(x),
          hidden: !filters.has(Filter.RMS),
        },
        {
          ...common,
          label: "rms-y",
          borderColor: colors.y,
          borderDash: lineStyles.y ?? [],
          data: getRootMeanSquare(y),
          hidden: !filters.has(Filter.RMS),
        },
        {
          ...common,
          label: "rms-z",
          borderColor: colors.z,
          borderDash: lineStyles.z ?? [],
          data: getRootMeanSquare(z),
          hidden: !filters.has(Filter.RMS),
        },
      ],
    },
    options: {
      animation: false,
      responsive,
      maintainAspectRatio: false,
      interaction: {
        // @ts-expect-error null disables interaction - the type information is wrong.
        mode: null,
      },
      hover: {
        // @ts-expect-error null disables hover - the type information is wrong.
        mode: null,
      },
      normalized: true,
      parsing: false,
      scales: {
        x: {
          type: "linear",
          min: 0,
          // We start at zero.
          max: rawX.length - 1,
          grid: {
            drawTicks: false,
            display: false,
          },
          ticks: {
            display: false, //this will remove only the label
          },
          display: false,
        },
        y: {
          type: "linear",
          min: -maxAccelerationScaleForGraphs,
          max: maxAccelerationScaleForGraphs,
          grid: {
            drawTicks: false,
            // shows the x axis line when we're in the feature view
            display: featureView,
            lineWidth: (ctx) => (ctx.tick.value === 0 ? 1.5 : 0),
          },
          ticks: {
            callback: function (val) {
              return val === 0 ? this.getLabelForValue(val) : "";
            },
            // shows the x axis label when we're in the feature view
            display: featureView, //this will remove only the label
          },
          display: featureView,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
    },
  };
};

function highlightPoints(
  context: ScriptableContext<"line">,
  filters: Set<Filter>
) {
  let isHighlighted: boolean = false;

  if (filters.has(Filter.MAX)) {
    isHighlighted = isHighlighted || getMaxPoint(context);
  }

  if (filters.has(Filter.MIN)) {
    isHighlighted = isHighlighted || getMinPoint(context);
  }

  if (filters.has(Filter.PEAKS)) {
    isHighlighted = isHighlighted || labelPeaks(context);
  }

  return isHighlighted ? 5 : 0;
}

function highlightSegments(
  context: ScriptableLineSegmentContext,
  points: Pos[],
  filters: Set<Filter>
) {
  let isHighlighted: boolean = false;

  if (filters.has(Filter.ZCR)) {
    isHighlighted = isHighlighted || getZeroCrossingPoints(context, points);
  }

  return isHighlighted ? 4 : 1;
}

function colourSegments(
  context: ScriptableLineSegmentContext,
  points: Pos[],
  filters: Set<Filter>,
  colour: string,
  showLine: boolean
) {
  if (filters.has(Filter.ZCR) && !showLine) {
    return getZeroCrossingPoints(context, points) ? colour : "transparent";
  }

  return colour;
}

// returns a boolean depending on whether the showLine setting should be true or false
// if filters contains zcr we don't want to hide the line as this will hide the segments as well
// instead, we set the non-zcr to 0 width so they don't appear and set shouldShowLine to true
function shouldShowLine(showLines: boolean, filters: Set<Filter>) {
  return filters.has(Filter.ZCR) ? true : showLines;
}

function yValuesFromCtx(context: ScriptableContext<"line">) {
  const points = context.dataset.data as Pos[];

  const data: number[] = [];
  points.map((point) => {
    data.push(point.y);
  }, [] as number[]);

  return data;
}

function toHorizontalLine(value: number, count: number): Pos[] {
  return [
    { x: 0, y: value },
    { x: count, y: value },
  ];
}

// get the indices of the max values in the x,y, and z directions
function getMaxPoint(context: ScriptableContext<"line">) {
  const data = yValuesFromCtx(context);

  const maxIndex = data.indexOf(Math.max(...data));
  const isMax = context.dataIndex == maxIndex;
  return isMax;
}

function getMinPoint(context: ScriptableContext<"line">) {
  const data = yValuesFromCtx(context);

  const minIndex = data.indexOf(Math.min(...data));
  const isMin = context.dataIndex == minIndex;
  return isMin;
}

function labelPeaks(context: ScriptableContext<"line">) {
  const data = yValuesFromCtx(context);

  const peaks = peakIndices(data);

  return peaks.includes(context.dataIndex);
}

function getMean(points: Pos[]) {
  return toHorizontalLine(_mean(points), points.length);
}

function getStdDev(points: Pos[], positive: boolean) {
  return toHorizontalLine(_stddev(points, positive), points.length);
}

function getZeroCrossingPoints(
  context: ScriptableLineSegmentContext,
  points: Pos[]
) {
  interface LineSegment {
    start: number;
    end: number;
  }
  // const data = yValuesFromCtx(context);
  const data: number[] = [];
  points.map((point) => {
    data.push(point.y);
  }, [] as number[]);

  const indices: LineSegment[] = [];

  for (let i = 1; i < data.length; i++) {
    if (
      (data[i] >= 0 && data[i - 1] < 0) ||
      (data[i] < 0 && data[i - 1] >= 0)
    ) {
      indices.push({ start: i - 1, end: i });
    }
  }

  const crossing = indices.some(({ start, end }) => {
    return context.p0DataIndex === start && context.p1DataIndex === end;
  });

  return crossing;
}

function getRootMeanSquare(points: Pos[]) {
  const rms = Math.sqrt(
    points.reduce((acc, { y }) => acc + Math.pow(y, 2), 0) / points.length
  );

  return toHorizontalLine(rms, points.length);
}

function _mean(points: Pos[]): number {
  const sum = points.reduce((sum, point) => {
    return point.y + sum;
  }, 0);

  const mean = sum / points.length;

  return mean;
}

function _stddev(points: Pos[], positive: boolean) {
  const mean = _mean(points);

  const stddev = Math.sqrt(
    points.reduce((acc, point) => acc + Math.pow(point.y - mean, 2), 0) /
      points.length
  );

  return positive ? mean + stddev : mean - stddev;
}

function peakIndices(data: number[]) {
  // how many points are used in the rolling calculation
  const lag = 5;
  // how many stddev away from the mean a point needs to be a signal
  const threshold = 3.5;
  const influence = 0.5;

  let peaksCounter = 0;
  const indices: number[] = [];

  if (data.length < lag + 2) {
    throw new Error("data sample is too short");
  }

  const mean = (data: number[]) => {
    return data.reduce((a, b) => a + b) / data.length;
  };

  const stddev = (data: number[]) => {
    return Math.sqrt(
      data.reduce((a, b) => a + Math.pow(b - mean(data), 2), 0) / data.length
    );
  };

  // init variables
  const signals = Array(data.length).fill(0) as number[];
  const filteredY = data.slice(0);
  const lead_in = data.slice(0, lag);

  const avgFilter: number[] = [];
  avgFilter[lag - 1] = mean(lead_in);
  const stdFilter: number[] = [];
  stdFilter[lag - 1] = stddev(lead_in);

  // for each data point
  for (let i = lag; i < data.length; i++) {
    // how far away from the previous mean is the next value?
    if (
      Math.abs(data[i] - avgFilter[i - 1]) > 0.1 &&
      Math.abs(data[i] - avgFilter[i - 1]) > threshold * stdFilter[i - 1]
    ) {
      // if the data point is larger than --> going up
      if (data[i] > avgFilter[i - 1]) {
        signals[i] = +1; // positive signal
        // only record if this is the start of a peak (previously not a peak)
        if (i - 1 > 0 && signals[i - 1] == 0) {
          peaksCounter++;
          indices.push(i);
        }
      } else {
        signals[i] = -1; // negative signal
      }
      // make influence lower
      filteredY[i] = influence * data[i] + (1 - influence) * filteredY[i - 1];
    } else {
      signals[i] = 0; // no signal
      filteredY[i] = data[i];
    }

    // adjust the filters
    const y_lag = filteredY.slice(i - lag, i);
    avgFilter[i] = mean(y_lag);
    stdFilter[i] = stddev(y_lag);
  }

  console.log(peaksCounter);
  console.log(indices);
  console.log(signals);
  return indices;
}
