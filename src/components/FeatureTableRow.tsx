import { Box, Card, Grid, GridItem, HStack, VStack } from "@chakra-ui/react";
import { ActionData, FeaturesView, XYZData } from "../model";
import { useStore } from "../store";
import { calculateGradientColor } from "../utils/gradient-calculator";
import { applyFilter } from "../ml";
import RecordingGraph from "./RecordingGraph";
import { FormattedMessage } from "react-intl";
import { Filter, mlSettings } from "../mlConfig";
import { useRef } from "react";

interface FeaturesTableRowProps {
  action: ActionData;
  expanded: boolean;
  onClick?: (rowID: number) => void;
}

const FeatureTableRow = ({
  action,
  expanded,
  onClick,
}: FeaturesTableRowProps) => {
  const { featuresView } = useStore((s) => s.settings);

  const filters = mlSettings.includedFilters;

  return (
    <
      // height={expanded ? ref.current?.scrollHeight : "100px"}
      // transition={"height 0.3s ease"}
      // overflow={"hidden"}
    >
      <GridItem h="100%" w="100%">
        <FeatureHeaderRow
          action={action}
          view={featuresView}
          expanded={expanded}
          onClick={onClick}
        />
      </GridItem>

      {Array.from(filters).map((filter, idx) => (
        <GridItem key={idx}>
          <FeatureCard
            action={action}
            filter={filter}
            view={featuresView}
            expanded={expanded}
          />
        </GridItem>
      ))}
    </>
  );
};

interface FeatureHeaderRowProps {
  action: ActionData;
  view: FeaturesView;
  expanded: boolean;
  onClick?: (rowID: number) => void;
}

const FeatureHeaderRow = ({
  action,
  view,
  expanded,
  onClick,
}: FeatureHeaderRowProps) => {
  return (
    <Card
      h="100%"
      w="100%"
      p={2}
      display={"flex"}
      borderWidth={0}
      position={"relative"}
      onClick={() => onClick?.(action.ID)}
    >
      <Grid
        templateColumns={`repeat(2, auto)`}
        templateRows={`repeat(${action.recordings.length}, auto)`}
        alignContent={"center"}
        alignItems={"center"}
        textAlign={"center"}
        gap={2}
      >
        <GridItem rowSpan={action.recordings.length}>
          <FormattedMessage id={action.name} />
        </GridItem>

        {expanded &&
          (view === FeaturesView.Colour ||
            view == FeaturesView.ColourAndValues) && (
            <>
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

interface FeatureCardProps {
  action: ActionData;
  filter: Filter;
  expanded: boolean;
  view: FeaturesView;
}

const FeatureCard = ({ action, filter, expanded, view }: FeatureCardProps) => {
  const numberOfAxes = 3;

  // // TODO: this is definitely not right by looking at the graphs...
  // const averaged = (): XYZData[] => {
  //   const averaged_x = () => {
  //     if (action.recordings.length === 0) {
  //       return [];
  //     }

  //     const dataLength = action.recordings[0].data.x.length;
  //     return Array.from({ length: dataLength }, (_, i) => {
  //       const sum = action.recordings.reduce((total, recording) => {
  //         return total + (recording.data.x[i] ?? 0);
  //       }, 0);

  //       const count = action.recordings.reduce(
  //         (count, recording) => (recording.data.x[i] ? 1 : 0 + count),
  //         0
  //       );
  //       return sum / count;
  //     });
  //   };

  //   const averaged_y = () => {
  //     if (action.recordings.length === 0) {
  //       return [];
  //     }

  //     const dataLength = action.recordings[0].data.y.length;
  //     return Array.from({ length: dataLength }, (_, i) => {
  //       const sum = action.recordings.reduce((total, recording) => {
  //         return total + (recording.data.y[i] ?? 0);
  //       }, 0);
  //       const count = action.recordings.reduce(
  //         (count, recording) => count + (recording.data.y[i] ? 1 : 0),
  //         0
  //       );
  //       return sum / count;
  //     });
  //   };

  //   const averaged_z = () => {
  //     if (action.recordings.length === 0) {
  //       return [];
  //     }

  //     const dataLength = action.recordings[0].data.z.length;
  //     return Array.from({ length: dataLength }, (_, i) => {
  //       const sum = action.recordings.reduce((total, recording) => {
  //         return total + (recording.data.z[i] ?? 0);
  //       }, 0);

  //       const count = action.recordings.reduce(
  //         (count, recording) => (recording.data.z[i] ? 1 : 0 + count),
  //         0
  //       );
  //       return sum / count;
  //     });
  //   };

  //   return [{ x: averaged_x(), y: averaged_y(), z: averaged_z() }];
  // };

  // const allData = (): XYZData[] => {
  //   return action.recordings.map((recording) => recording.data);
  // };

  const numberOfRows = expanded ? action.recordings.length : 1;

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
        <Grid templateRows={`repeat(${numberOfRows}, 1fr)`} gap={2}>
          <>
            {(expanded ? action.recordings : [action.recordings[0]]).map((recording, idx) => (
              <GridItem key={idx}>
                <RecordingGraphFeatureValues data={recording.data} filter={filter} />
              </GridItem>
            ))}
          </>
        </Grid>
      )}

      {(view === FeaturesView.Colour ||
        view === FeaturesView.ColourAndValues) && (
        <Grid
          templateColumns={`repeat(${numberOfAxes}, auto)`}
          templateRows={`repeat(${numberOfRows}, auto)`}
          rowGap={1}
        >
          {(expanded ? action.recordings : [action.recordings[0]]).map((recording, idx) => (
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

export default FeatureTableRow;
