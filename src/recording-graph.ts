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
} from "chart.js";
import { GraphLineStyles } from "./hooks/use-graph-line-styles";
import { maxAccelerationScaleForGraphs } from "./mlConfig";
import { XYZData } from "./model";
import { GraphLineWeight } from "./settings";
import { min } from "d3";
import { border } from "@chakra-ui/react";

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

export const getConfig = (
  { x: rawX, y: rawY, z: rawZ }: XYZData,
  responsive: boolean,
  colors: GraphColors,
  lineStyles: GraphLineStyles,
  graphLineWeight: GraphLineWeight
): ChartConfiguration<keyof ChartTypeRegistry, Pos[], string> => {
  const x = processDimensionData(rawX);
  const y = processDimensionData(rawY);
  const z = processDimensionData(rawZ);
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
          data: x,
          pointRadius: getMaxPoint,
        },
        {
          ...common,
          label: "y",
          borderColor: colors.y,
          borderDash: lineStyles.y ?? [],
          data: y,
        },
        {
          ...common,
          label: "z",
          borderColor: colors.z,
          borderDash: lineStyles.z ?? [],
          data: z,
        },
        {
          ...common,
          label: "mean",
          borderColor: "#d507b3",
          data: getMean(x),
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
            display: false,
          },
          ticks: {
            display: false, //this will remove only the label
          },
          display: false,
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
//     Filter.MAX,
// Filter.MEAN,
// Filter.MIN,
// Filter.STD,
// Filter.PEAKS,
// Filter.ACC,
// Filter.ZCR,
// Filter.RMS,

// get the indices of the max values in the x,y, and z directions
function getMaxPoint(context: ScriptableContext<"line">) {
  const points = context.dataset.data as { x: number; y: number }[];

  const data: number[] = [];
  points.map((point) => {
    data.push(point.y);
  }, [] as number[]);

  const maxIndex = data.indexOf(Math.max(...data));
  const isMax = context.dataIndex == maxIndex;
  return isMax ? 10 : 0;
  return 0;
}

function getMinPoint(context: ScriptableContext<"line">) {
  const points = context.dataset.data as { x: number; y: number }[];

  const data: number[] = [];
  points.map((point) => {
    data.push(point.y);
  }, [] as number[]);

  const minIndex = data.indexOf(Math.min(...data));
  const isMin = context.dataIndex == minIndex;
  return isMin ? 10 : 0;
  return 0;
}

function getMean(points: Pos[]): Pos[] {
  const sum = points.reduce((sum, point) => {
    return point.y + sum;
  }, 0);

  const mean = sum / points.length;

  return [
    { x: 0, y: mean },
    { x: points.length, y: mean },
  ];
}


