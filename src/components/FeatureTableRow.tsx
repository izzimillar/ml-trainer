import { Card, Grid, GridItem } from "@chakra-ui/react";
import { ActionData, RecordingData, XYZData } from "../model";
import { useStore } from "../store";
import { calculateGradientColor } from "../utils/gradient-calculator";
import { applyFilters } from "../ml";
import RecordingGraph from "./RecordingGraph";
import { FormattedMessage } from "react-intl";

interface FeaturesTableRowProps {
  action: ActionData;
}

const FeaturesTableRow = ({ action }: FeaturesTableRowProps) => {
  return (
    <>
      <GridItem rowSpan={action.recordings.length} colSpan={2}>
        <FeatureHeaderRow action={action} />
      </GridItem>

      {action.recordings.map((recording, idx) => (
        <GridItem key={idx}>
          <RecordingGraphFeatureValues key={idx} recording={recording} />
        </GridItem>
        // <FeatureValuesRow key={idx} data={recording.data} />
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

const FeatureValuesRow = ({ data }: { data: XYZData }) => {
  const dataWindow = useStore((s) => s.dataWindow);
  const dataFeatures = applyFilters(data, dataWindow, { normalize: true });

  return (
    <>
      {Object.keys(dataFeatures).map((feature, idx) => (
        <NumberBlock key={idx} value={dataFeatures[feature]} />
      ))}
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
      w="56px"
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
