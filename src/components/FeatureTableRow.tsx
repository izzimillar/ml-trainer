import { Card, Grid, GridItem, VStack } from "@chakra-ui/react";
import { ActionData, RecordingData, XYZData } from "../model";
import { useStore } from "../store";
import { calculateGradientColor } from "../utils/gradient-calculator";
import { applyFilter, applyFilters } from "../ml";
import RecordingGraph from "./RecordingGraph";
import { FormattedMessage } from "react-intl";
import { Filter, mlSettings } from "../mlConfig";

interface FeaturesTableRowProps {
  action: ActionData;
}

const FeaturesTableRow = ({ action }: FeaturesTableRowProps) => {
  const filters = mlSettings.includedFilters;
  const numberOfAxes = 3;

  return (
    <>
      <GridItem>
        <FeatureHeaderRow action={action} />
      </GridItem>

      {Array.from(filters).map((filter, idx) => (
        <GridItem key={idx}>
          <Grid
            templateColumns={`repeat(${numberOfAxes}, 1fr)`}
            templateRows={`repeat(${action.recordings.length}, 1fr)`}
          >
            <>
              {action.recordings.map((recording, idx) => (
                <FeatureValues
                  key={idx}
                  filter={filter}
                  data={recording.data}
                />
              ))}
            </>
          </Grid>
        </GridItem>
      ))}
    </>
  );
};

const FeatureHeaderRow = ({ action }: { action: ActionData }) => {
  return (
    <Card>
      <Grid
        templateColumns={`repeat(2, auto)`}
        templateRows={`repeat(${action.recordings.length}, auto)`}
        alignItems="center"
        py={2}
      >
        <GridItem rowSpan={action.recordings.length}>
          <FormattedMessage id={action.name} />
        </GridItem>

        {action.recordings.map((recording, idx) => (
          <GridItem key={idx}>
            <RecordingGraph data={recording.data} h={56} w={96} />
          </GridItem>
        ))}
      </Grid>
    </Card>
  );
};

const FeatureValues = ({ data, filter }: { data: XYZData; filter: Filter }) => {
  const dataWindow = useStore((s) => s.dataWindow);
  const { x, y, z } = applyFilter(filter, data, dataWindow, {
    normalize: true,
  });

  return (
    <>
      <NumberBlock value={x} />
      <NumberBlock value={y} />
      <NumberBlock value={z} />
    </>
  );
};

const ColourBlock = ({ value }: { value: number }) => {
  return (
    <GridItem
      h={"56px"}
      w="56px"
      backgroundColor={calculateGradientColor("#007DBC", value)}
    />
  );
};

const NumberBlock = ({ value }: { value: number }) => {
  const dp = 1000;
  const rounded = Math.round(value * dp) / dp;
  return (
    <GridItem
      h={"56px"}
      w={"56px"}
      textAlign={"center"}
      backgroundColor={calculateGradientColor("#007DBC", value)}
    >
      {`${rounded}`}
    </GridItem>
  );
};

const RecordingGraphFeatureValues = ({
  recording,
}: {
  recording: RecordingData;
}) => {
  return <RecordingGraph data={recording.data} h={300} w={450} />;
};

export default FeaturesTableRow;
