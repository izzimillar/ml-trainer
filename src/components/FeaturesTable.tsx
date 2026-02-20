import {
  Card,
  Checkbox,
  Grid,
  GridItem,
  GridProps,
  HStack,
  Text,
} from "@chakra-ui/react";
import FeatureTableRow from "./FeatureTableRow";
import { useStore } from "../store";
import { FormattedMessage } from "react-intl";
import { Filter, mlSettings } from "../mlConfig";
import ClickableTooltip from "./ClickableTooltip";
import HeadingGrid, { GridColumnHeadingItemProps } from "./HeadingGrid";
import ShowValuesCheckbox from "./ShowValuesCheckBox";
import { useCallback, useState } from "react";

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
  const [expandedRows, setExpandedRows] = useState<Set<number>>(
    new Set(actions.map((action) => action.ID))
  );

  const totalFilters = mlSettings.includedFilters.size;

  const toggleExpanded = (rowID: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(rowID) ? newSet.delete(rowID) : newSet.add(rowID);
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
          <FeatureTableRow
            key={idx}
            action={action}
            expanded={expandedRows.has(action.ID)}
            onClick={toggleExpanded}
            
          />
        ))}
      </Grid>
    </>
  );
};

const FeatureHeader = ({ feature }: { feature: Filter }) => {
  const axes = ["x", "y", "z"];

  const currentFilters = useStore((s) => s.trainingFeatures);
  const setFeatures = useStore((s) => s.setTrainingFeature);

  // let isIncluded = currentFilters.has(feature);

  const handleIncludeOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFeatures(feature, e.target.checked);
    },
    [setFeatures, feature]
  );
  // add tick box to this to allow/disable it
  return (
    <>
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

          <GridItem textAlign={"center"} colSpan={3}>
            <Checkbox
              isChecked={currentFilters.has(feature)}
              onChange={handleIncludeOnChange}
            >
              <FormattedMessage id="include" />
            </Checkbox>
          </GridItem>

          {/* x, y, z */}
          {axes.map((axis, idx) => (
            <GridItem
              key={idx}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              gridRow={2}
            >
              <ClickableTooltip
                placement="end-end"
                label={
                  <Text p={3}>
                    <FormattedMessage
                      id={`fingerprint-${feature}-${axis}-tooltip`}
                    />
                  </Text>
                }
              >
                <FormattedMessage id={`${axis}`} />
              </ClickableTooltip>
            </GridItem>
          ))}
        </Grid>
      </Card>
    </>
  );
};

export default FeaturesTable;
