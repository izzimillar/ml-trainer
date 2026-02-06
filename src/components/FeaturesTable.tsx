import { Box, Card, Grid, GridItem, GridProps, Text } from "@chakra-ui/react";
import FeaturesTableRow from "./FeatureTableRow";
import { useStore } from "../store";
import { FormattedMessage } from "react-intl";
import { Filter, mlSettings } from "../mlConfig";
import ClickableTooltip from "./ClickableTooltip";

export const gridCommonProps: Partial<GridProps> = {
  gap: 3,
  px: 5,
  w: "100%",
};

const FeaturesTable = () => {
  const actions = useStore((s) => s.actions);

  const totalRecordings = actions.reduce((acc, action) => {
    return action.recordings.length + acc;
  }, 0);
  const totalFilters = mlSettings.includedFilters.size;

  return (
    <>
      <Grid
        {...gridCommonProps}
        py={2}
        alignItems="center"
        autoRows="max-content"
        overflow="auto"
        flexGrow={1}
        h={0}
        templateColumns={`auto auto repeat(${totalFilters * 3}, 1fr)`}
        templateRows={`auto auto repeat(${totalRecordings}, 1fr)`}
      >
        <GridItem colSpan={2} rowSpan={2} />
        {/* feature headings */}
        {Array.from(mlSettings.includedFilters).map((filter, idx) => (
          <GridItem key={idx} colSpan={3} rowSpan={2}>
            <FeatureHeader key={idx} feature={filter} />
          </GridItem>
        ))}

        {/* rows */}
        {actions.map((action, idx) => (
          <Box key={idx} display="contents">
            <FeaturesTableRow key={idx} action={action} />
          </Box>
        ))}
      </Grid>
    </>
  );
};

const FeatureHeader = ({ feature }: { feature: Filter }) => {
  const axes = ["x", "y", "z"];

  // add tick box to this to allow/disable it
  return (
    <>
      <ClickableTooltip
        placement="end-end"
        label={
          <Text p={3}>
            {/* this should't be default x but is ok for now */}
            <FormattedMessage id={`fingerprint-${feature}-x-tooltip`} />
          </Text>
        }
      >
        <Card
          h="100%"
          w="100%"
          p={2}
          display={"flex"}
          borderWidth={1}
          position={"relative"}
        >
          <GridItem textAlign={"center"} colSpan={3} rowSpan={1}>
            <FormattedMessage id={`${feature}`} />
          </GridItem>

          <Grid>
            {axes.map((axis, idx) => (
              <GridItem key={idx} textAlign={"center"} gridRow={2}>
                <FormattedMessage id={`${axis}`} />
              </GridItem>
            ))}
          </Grid>
        </Card>
      </ClickableTooltip>
    </>
  );
};

export default FeaturesTable;
