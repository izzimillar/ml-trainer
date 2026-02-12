import {
  Card,
  Grid,
  GridItem,
  GridProps,
  HStack,
  Text,
} from "@chakra-ui/react";
import FeaturesTableRow from "./FeatureTableRow";
import { useStore } from "../store";
import { FormattedMessage } from "react-intl";
import { Filter, mlSettings } from "../mlConfig";
import ClickableTooltip from "./ClickableTooltip";
import HeadingGrid, { GridColumnHeadingItemProps } from "./HeadingGrid";
import ShowValuesCheckbox from "./ShowValuesCheckBox";

const gridCommonProps: Partial<GridProps> = {
  gap: 3,
  px: 5,
  w: "100%",
};

const headings: GridColumnHeadingItemProps[] = [
  // {
  //   titleId: "action-label",
  //   descriptionId: "action-tooltip",
  // },
  {
    // TODO: localise this
    titleId: "features",
    descriptionId: "data-samples-tooltip",
    itemsRight: (
      <HStack>
        <ShowValuesCheckbox />
        {/* <DataSamplesMenu /> */}
      </HStack>
    ),
  },
];

const FeaturesTable = () => {
  const actions = useStore((s) => s.actions);

  // const totalRecordings = actions.reduce((acc, action) => {
  //   return action.recordings.length + acc;
  // }, 0);
  const totalFilters = mlSettings.includedFilters.size;

  return (
    <>
      <HeadingGrid
        position={"sticky"}
        top={0}
        {...gridCommonProps}
        headings={headings}
      />
      <Grid
        {...gridCommonProps}
        py={2}
        alignItems="center"
        autoRows="max-content"
        overflow="auto"
        flexGrow={1}
        h={0}
        //  ACTION NAME | FEATURES...
        templateColumns={`auto repeat(${totalFilters}, 1fr)`}
        //  FEATURE NAME | ACTIONS...
        templateRows={`auto repeat(${actions.length}, 1fr)`}
      >
        {/* empty top left cell */}
        <GridItem />

        {/* feature headings */}
        {Array.from(mlSettings.includedFilters).map((filter, idx) => (
          <GridItem key={idx}>
            <FeatureHeader key={idx} feature={filter} />
          </GridItem>
        ))}

        {/* features */}
        {actions.map((action, idx) => (
          <FeaturesTableRow key={idx} action={action} />
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
            {/* TODO: change this to be a correct description */}
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
          <Grid>
            {/* feature name */}
            <GridItem textAlign={"center"} colSpan={3} rowSpan={1}>
              <FormattedMessage id={`${feature}`} />
            </GridItem>

            {/* x, y, z */}
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
