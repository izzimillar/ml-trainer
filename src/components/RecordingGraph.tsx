/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 * Modifications (c) 2024, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Box, BoxProps } from "@chakra-ui/react";
import {
  Chart,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  registerables,
} from "chart.js";
import { useEffect, useRef } from "react";
import { useGraphColors } from "../hooks/use-graph-colors";
import { useGraphLineStyles } from "../hooks/use-graph-line-styles";
import { XYZData } from "../model";
import { getConfig as getRecordingChartConfig } from "../recording-graph";
import { useSettings } from "../store";
import { Filter } from "../mlConfig";

interface RecordingGraphProps extends BoxProps {
  data: XYZData;
  responsive?: boolean;
  filters?: Set<Filter>;
  showLines?: boolean;
  featureView?: boolean;
}

const RecordingGraph = ({
  data,
  responsive = false,
  children,
  filters = new Set<Filter>(),
  showLines = true,
  featureView = false,
  ...rest
}: RecordingGraphProps) => {
  const [{ graphColorScheme, graphLineScheme, graphLineWeight }] =
    useSettings();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = useGraphColors(graphColorScheme);
  const lineStyles = useGraphLineStyles(graphLineScheme);
  useEffect(() => {
    Chart.unregister(...registerables);
    Chart.register([
      LinearScale,
      LineController,
      PointElement,
      LineElement,
      Filler,
    ]);
    const chart = new Chart(
      canvasRef.current?.getContext("2d") ?? new HTMLCanvasElement(),
      getRecordingChartConfig(
        data,
        responsive,
        colors,
        lineStyles,
        graphLineWeight,
        filters,
        showLines,
        featureView,
      )
    );
    return () => {
      chart.destroy();
    };
  }, [
    colors,
    data,
    graphLineWeight,
    lineStyles,
    responsive,
    filters,
    showLines,
    featureView,
  ]);

  return (
    <Box
      borderRadius="md"
      borderWidth={1}
      borderColor="gray.200"
      height="100%"
      position="relative"
      {...rest}
    >
      {/* canvas dimensions must account for parent border width */}
      <canvas width={"156px"} height={"96px"} ref={canvasRef} />
      {children}
    </Box>
  );
};

export default RecordingGraph;
