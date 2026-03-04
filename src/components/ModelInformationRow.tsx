import { Card, Grid, GridItem } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Filter } from "../mlConfig";
import { useStore } from "../store";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { createFeaturesPageUrl } from "../urls";

interface ModelInformationRowProps {
  trainingFeatures: Set<Filter>;
}

const ModelInformationRow = ({
  trainingFeatures,
}: ModelInformationRowProps) => {
  const navigate = useNavigate();
  const currentModel = useStore((s) => s.modelDetails);
  // const previousModels = useStore((s) => s.previousModels);
  // add in a row for all previous models

  const navigateToFeatures = useCallback(() => {
    navigate(createFeaturesPageUrl());
  }, [navigate]);

  useEffect(() => {
    if (!currentModel) {
      return navigateToFeatures();
    }
  });

  const numberOfTrainingSamples = () => {
    if (currentModel) {
      return currentModel.actions.reduce((acc, action) => acc + action.recordings.length, 0)
    }
    return 0;
  };

  const accuracy = () => {
    if (currentModel) {
      return currentModel.testResults ? 
        currentModel.testResults.error ? 
          "not tested yet" : currentModel.testResults.accuracy 
        : "not tested yet"
    }
    return "not tested yet";
  };

  return currentModel ? (
    <Grid templateColumns={`repeat(4, auto)`} templateRows={"repeat(2, 1fr)"}>
      <GridItem>
        <Card>
          <FormattedMessage id="Model name" />
        </Card>
      </GridItem>

      <GridItem>
        <Card>
          {Array.from(trainingFeatures).map((feature, idx) => (
            <FormattedMessage key={idx} id={feature} />
          ))}
        </Card>
      </GridItem>

      <GridItem>
        <Card>
          <FormattedMessage id="Number of samples trained on" />
        </Card>
      </GridItem>

      <GridItem>
        <Card>
          <FormattedMessage id="accuracy" />
        </Card>
      </GridItem>

      <GridItem>
        <Card>
          <FormattedMessage id={currentModel.name} />
        </Card>
      </GridItem>

      <GridItem>
        <Card>
          {Array.from(trainingFeatures).map((feature, idx) => (
            <FormattedMessage key={idx} id={feature} />
          ))}
        </Card>
      </GridItem>

      <GridItem>
        <Card>
          <FormattedMessage id={`number: ${numberOfTrainingSamples() - currentModel.testSampleIds.length}`} />
        </Card>
      </GridItem>

      <GridItem>
        <Card>
          <FormattedMessage id={`acc: ${accuracy()}`} />
        </Card>
      </GridItem>
    </Grid>
  ) : (
    <></>
  );
};

export default ModelInformationRow;
