import { Card, Grid, GridItem } from "@chakra-ui/react";
import { ActionData, FeaturesView, XYZData } from "../model";
import { useStore } from "../store";
import { calculateGradientColor } from "../utils/gradient-calculator";
import { applyFilter } from "../ml";
import RecordingGraph from "./RecordingGraph";
import { FormattedMessage } from "react-intl";
import { Filter, mlSettings } from "../mlConfig";

interface FeaturesTableRowProps {
  action: ActionData;
}

const FeaturesTableRow = ({ action }: FeaturesTableRowProps) => {
  const { featuresView } = useStore((s) => s.settings);

  const filters = mlSettings.includedFilters;

  return (
    <>
      <GridItem h="100%" w="100%">
        <FeatureHeaderRow action={action} view={featuresView} />
      </GridItem>

      {Array.from(filters).map((filter, idx) => (
        <GridItem key={idx}>
          <FeatureCard action={action} filter={filter} view={featuresView} />
        </GridItem>
      ))}
    </>
  );
};

const FeatureHeaderRow = ({
  action,
  view,
}: {
  action: ActionData;
  view: FeaturesView;
}) => {
  return (
    <Card
      h="100%"
      w="100%"
      p={2}
      display={"flex"}
      borderWidth={0}
      position={"relative"}
    >
      <Grid
        templateColumns={`repeat(2, auto)`}
        templateRows={`repeat(${action.recordings.length}, auto)`}
        alignContent={"center"}
        alignItems={"center"}
        textAlign={"center"}
        gap={2}
      >
        {(view === FeaturesView.Graph ||
          view === FeaturesView.GraphNoLines) && (
          <GridItem rowSpan={action.recordings.length} colSpan={2}>
            <FormattedMessage id={action.name} />
          </GridItem>
        )}

        {(view === FeaturesView.Colour ||
          view == FeaturesView.ColourAndValues) && (
          <>
            <GridItem rowSpan={action.recordings.length}>
              <FormattedMessage id={action.name} />
            </GridItem>
            {action.recordings.map((recording, idx) => (
              <GridItem key={idx}>
                <RecordingGraph data={recording.data} h={56} w={96} />
              </GridItem>
            ))}
          </>
        )}
      </Grid>
    </Card>
  );
};

const FeatureCard = ({
  action,
  filter,
  view,
}: {
  action: ActionData;
  filter: Filter;
  view: FeaturesView;
}) => {
  const numberOfAxes = 3;

  return (
    <Card
      p={2}
      display="flex"
      flexDirection="row"
      width="fit-content"
      borderColor={"transparent"}
      borderWidth={1}
    >
      {(view === FeaturesView.Graph || view === FeaturesView.GraphNoLines) && (
        <Grid templateRows={`repeat(${action.recordings.length}, 1fr)`} gap={2}>
          <>
            {action.recordings.map((recording, idx) => (
              <GridItem key={idx}>
                <RecordingGraphFeatureValues
                  data={recording.data}
                  filter={filter}
                />
              </GridItem>
            ))}
          </>
        </Grid>
      )}

      {(view === FeaturesView.Colour ||
        view === FeaturesView.ColourAndValues) && (
        <Grid
          templateColumns={`repeat(${numberOfAxes}, auto)`}
          templateRows={`repeat(${action.recordings.length}, auto)`}
          rowGap={1}
        >
          {action.recordings.map((recording, idx) => (
            <FeatureValues
              key={idx}
              data={recording.data}
              filter={filter}
              num_recordings={action.recordings.length}
            />
          ))}
        </Grid>
      )}
    </Card>
  );
};

interface FeatureValuesProps {
  data: XYZData;
  filter: Filter;
  num_recordings: number;
}

const FeatureValues = ({ data, filter }: FeatureValuesProps) => {
  const { featuresView } = useStore((s) => s.settings);

  const dataWindow = useStore((s) => s.dataWindow);
  const { x, y, z } = applyFilter(filter, data, dataWindow, {
    normalize: true,
  });

  return (
    <>
      {featuresView === FeaturesView.Colour && (
        <>
          <ColourBlock value={x} />
          <ColourBlock value={y} />
          <ColourBlock value={z} />
        </>
      )}

      {featuresView === FeaturesView.ColourAndValues && (
        <>
          <NumberBlock value={x} />
          <NumberBlock value={y} />
          <NumberBlock value={z} />
        </>
      )}
    </>
  );
};

const ColourBlock = ({ value }: { value: number }) => {
  return (
    <GridItem
      h={"60px"}
      w="60px"
      backgroundColor={calculateGradientColor("#007DBC", value)}
    />
  );
};

const NumberBlock = ({ value }: { value: number }) => {
  const dp = 1000;
  const rounded = Math.round(value * dp) / dp;
  return (
    <GridItem
      h={"60px"}
      w={"60px"}
      textAlign={"center"}
      alignContent={"center"}
      backgroundColor={calculateGradientColor("#007DBC", value)}
    >
      {`${rounded}`}
    </GridItem>
  );
};

const RecordingGraphFeatureValues = ({
  data,
  filter,
}: {
  data: XYZData;
  filter: Filter;
}) => {
  const { showGraphLines } = useStore((s) => s.settings);

  return (
    <RecordingGraph
      data={data}
      h={120}
      w={200}
      filters={new Set<Filter>([filter])}
      showLines={showGraphLines}
      featureView={true}
    />
  );
};

export default FeaturesTableRow;
