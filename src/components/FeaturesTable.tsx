import {
  Box,
  Grid,
  GridItem,
  GridProps,
} from "@chakra-ui/react";
import FeaturesTableRow from "./FeatureTableRow";
import { useStore } from "../store";
import { FormattedMessage } from "react-intl";
import { Filter, mlSettings } from "../mlConfig";

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
  const totalFilters = mlSettings.includedFilters.size * 3;

  return (
    <>
      <Grid
        {...gridCommonProps}
        py={2}
        alignItems="start"
        autoRows="max-content"
        overflow="auto"
        flexGrow={1}
        h={0}
        templateColumns={`repeat(${totalFilters + 2}, 1fr)`}
        teamplateRows={`repeat(${totalRecordings + 2}, max-content)`}
      >
        <GridItem colSpan={2} />
        {/* feature headings */}
        {/* <HStack> */}
        {Array.from(mlSettings.includedFilters).map((filter, idx) => (
          <FeatureHeader key={idx} feature={filter} />
        ))}
        {/* </HStack> */}

        {/* rows */}
        {actions.map((action, idx) => (
          <Box key={idx} display="contents">
            <GridItem fontWeight="bold" rowSpan={action.recordings.length}>
              {action.name}
            </GridItem>
            {action.recordings.map((recording, idx) => (
              <FeaturesTableRow key={idx} data={recording.data} />
            ))}
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
      {axes.map((axis, idx) => (
        <GridItem key={idx}>
          <FormattedMessage id={`${feature}-${axis}`} />
        </GridItem>
      ))}

      {/* <Card
        h="100%"
        w="100%"
        p={2}
        display={"flex"}
        borderWidth={1}
        position={"relative"} */}
    </>
  );
};

export default FeaturesTable;
