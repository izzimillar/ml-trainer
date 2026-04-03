import { Grid, GridItem, GridProps, HStack } from "@chakra-ui/react";
import FeatureTableRow from "./FeatureTableRow";
import { useStore } from "../store";
import { Filter, mlSettings } from "../mlConfig";
import HeadingGrid, { GridColumnHeadingItemProps } from "./HeadingGrid";
import { useState } from "react";
import ShowValuesCheckbox from "./ShowValuesCheckBox";
import FeatureHeader from "./FeatureHeader";

const gridCommonProps: Partial<GridProps> = {
  gap: 3,
  px: 5,
  w: "100%",
  templateColumns: `180px auto`,
};

const headings: GridColumnHeadingItemProps[] = [
  {
    titleId: "Action",
    descriptionId: "action-tooltip",
  },
  {
    // TODO: localise this
    titleId: "Features",
    descriptionId:
      "The values that the model is trained on, calculated from the graphs. There is one number for each axis per data sample. Hover over the features below to find out more.",
    itemsRight: (
      <HStack>
        <ShowValuesCheckbox />
      </HStack>
    ),
  },
];

const FeaturesTable = () => {
  const actions = useStore((s) => s.actions);
  const features = Array.from(mlSettings.includedFilters);
  const [expandedActions, setExpandedActions] = useState<Set<number>>(
    new Set(actions.map((action) => action.ID))
  );
  const [expandedFeatures, setExpandedFeatures] = useState<Set<Filter>>(
    new Set(features)
  );

  const totalFilters = mlSettings.includedFilters.size;

  const toggleExpandedAction = (rowID: number) => {
    setExpandedActions((prev) => {
      const newSet = new Set(prev);
      newSet.has(rowID) ? newSet.delete(rowID) : newSet.add(rowID);
      return newSet;
    });
  };

  const toggleExpandedFeature = (feature: Filter) => {
    setExpandedFeatures((prev) => {
      const newSet = new Set(prev);
      newSet.has(feature) ? newSet.delete(feature) : newSet.add(feature);
      return newSet;
    });
  };

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
        templateColumns={`180px repeat(${totalFilters}, 1fr)`}
        //  FEATURE NAME | ACTIONS...
        templateRows={`auto repeat(${actions.length}, 1fr)`}
      >
        {/* empty top left cell */}
        <GridItem />

        {/* feature headings */}
        {features.map((filter, idx) => (
          <GridItem key={idx} h="100%">
            <FeatureHeader
              key={idx}
              feature={filter}
              expanded={expandedFeatures.has(filter)}
              onClick={toggleExpandedFeature}
            />
          </GridItem>
        ))}

        {/* features */}
        {actions.map((action, idx) => (
          <FeatureTableRow
            key={idx}
            action={action}
            expanded={expandedActions.has(action.ID)}
            expandedFeatures={expandedFeatures}
            onClick={toggleExpandedAction}
          />
        ))}
      </Grid>
    </>
  );
};

export default FeaturesTable;
