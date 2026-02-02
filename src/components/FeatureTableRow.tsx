import { Box, Card, Grid, GridItem, HStack } from "@chakra-ui/react";
import { ActionData, XYZData } from "../model";
import ActionNameCard, { ActionCardNameViewMode } from "./ActionNameCard";
import { applyFilters } from "../ml";
import { useStore } from "../store";
import { calculateGradientColor } from "../utils/gradient-calculator";
import RecordingFingerprint from "./RecordingFingerprint";

interface FeaturesTableRowProps {
  action: ActionData;
}

const FeaturesTableRow = ({ action }: FeaturesTableRowProps) => {
  return (
    <>
      <Box>
        <HStack>
        <GridItem>
          <ActionNameCard
            value={action}
            viewMode={ActionCardNameViewMode.Preview}
          />
=        </GridItem>

        <GridItem h={`90px`}>
          <HStack h={`90px`} spacing={2}>
          {action.recordings.map((recording, idx) => (
            <RecordingFingerprint key={idx} data={recording.data} size="md" />
            // <FeaturesGraphic key={idx} data={recording.data} />
          ))}
          </HStack>
        </GridItem>
        </HStack>
      </Box>
    </>
  );
};

const FeaturesGraphic = ({ data }: { data: XYZData }) => {
  const dataWindow = useStore((s) => s.dataWindow);
  const dataFeatures = applyFilters(data, dataWindow, { normalize: true });

  return (
    <>
      <Grid
        w={`92px`}
        h="100%"
        position="relative">
        {Object.keys(dataFeatures).map((k, idx) => (
          <GridItem
            key={idx}
            w="100%"
            backgroundColor={calculateGradientColor("#0f7344", dataFeatures[k])}
          />
        ))}
      </Grid>
    </>
  );
};

export default FeaturesTableRow;
