import { Card, Grid, GridItem } from "@chakra-ui/react";
import { ActionData, XYZData } from "../model";
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
        <RecordingFeaturesRow key={idx} data={recording.data} />
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

const RecordingFeaturesRow = ({ data }: { data: XYZData }) => {
  const dataWindow = useStore((s) => s.dataWindow);
  const dataFeatures = applyFilters(data, dataWindow, { normalize: true });

  return (
    <>
      {Object.keys(dataFeatures).map((feature, idx) => (
        <ColourBlock key={idx} value={dataFeatures[feature]} />
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

export default FeaturesTableRow;
