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
  const filters = mlSettings.includedFilters;

  return (
    <>
      <GridItem>
        <FeatureHeaderRow action={action} />
      </GridItem>

      {Array.from(filters).map((filter, idx) => (
        <GridItem key={idx}>
          <FeatureCard action={action} filter={filter} />
        </GridItem>
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

const FeatureCard = ({
  action,
  filter,
}: {
  action: ActionData;
  filter: Filter;
}) => {
  const numberOfAxes = 3;

  const { featuresView } = useStore((s) => s.settings);

  return (
    <>
      {featuresView === FeaturesView.Graph && (
        <Grid templateRows={`repeat(${action.recordings.length}, 1fr)`}>
          <>
            {action.recordings.map((recording, idx) => (
              <GridItem key={idx}>
                <RecordingGraph data={recording.data} />
              </GridItem>
            ))}
          </>
        </Grid>
      )}

      {featuresView !== FeaturesView.Graph && (
        <Grid
          templateColumns={`repeat(${numberOfAxes}, 1fr)`}
          templateRows={`repeat(${action.recordings.length}, 1fr)`}
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
    </>
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
      w={"56px"}
      textAlign={"center"}
      alignContent={"center"}
      backgroundColor={calculateGradientColor("#007DBC", value)}
    >
      {`${rounded}`}
    </GridItem>
  );
};

const RecordingGraphFeatureValues = ({ data }: { data: XYZData }) => {
  return <RecordingGraph data={data} h={300} w={450} />;
};

export default FeaturesTableRow;
