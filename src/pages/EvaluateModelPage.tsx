import { useCallback, useEffect } from "react";
import DefaultPageLayout from "../components/DefaultPageLayout";
import { createDataSamplesPageUrl, createTestingModelPageUrl } from "../urls";
import { useNavigate } from "react-router";
import { Button, Grid, GridProps, HStack, VStack } from "@chakra-ui/react";
import { RiArrowRightLine } from "react-icons/ri";
import { FormattedMessage } from "react-intl";
import { useStore } from "../store";
import ModelInformationRow from "../components/ModelInformationRow";
import BackArrow from "../components/BackArrow";
import HeadingGrid, {
  GridColumnHeadingItemProps,
} from "../components/HeadingGrid";
import { Filter } from "../mlConfig";

const gridCommonProps: Partial<GridProps> = {
  gridTemplateColumns: "200px 240px 200px 200px 340px 150px",
  gap: 3,
  w: "100%",
};

const headings: GridColumnHeadingItemProps[] = [
  {
    titleId: "Model name",
    // descriptionId: ""
  },
  {
    titleId: "Features",
    // descriptionId: "action-tooltip"
  },
  {
    titleId: "Training size",
  },
  {
    titleId: "Test size",
  },
  {
    titleId: "Accuracy",
  },
  {},
];

const EvaluateModelPage = () => {
  const model = useStore((s) => s.modelDetails);
  const previousModels = useStore((s) => s.previousModels);
  const saveModel = useStore((s) => s.saveModel);
  // const allFeatures: Set<Filter> = mlSettings.includedFilters;
  const features: Set<Filter> = useStore((s) => s.trainingFeatures);

  const savedIds = previousModels.map((model) => model.ID);

  const navigate = useNavigate();

  const handleNavigateToModel = useCallback(() => {
    navigate(createTestingModelPageUrl());
  }, [navigate]);

  const navigateToDataSamples = useCallback(() => {
    navigate(createDataSamplesPageUrl());
  }, [navigate]);

  const handleSaveModel = useCallback(() => {
    saveModel();
  }, [saveModel]);

  useEffect(() => {
    if (!model) {
      return navigateToDataSamples();
    }
  });

  return model ? (
    <DefaultPageLayout
      titleId="Train and test model"
      showPageTitle
      toolbarItemsLeft={
        <Button
          leftIcon={<BackArrow />}
          variant="toolbar"
          onClick={navigateToDataSamples}
        >
          <FormattedMessage id="Edit data samples" />
        </Button>
      }
    >
      <VStack>
        <HeadingGrid
          position="sticky"
          top={0}
          px={5}
          {...gridCommonProps}
          headings={headings}
        />
        <Grid
          {...gridCommonProps}
          alignItems="stretch"
          autoRows="max-content"
          overflow="auto"
          flexGrow={1}
        >
          <ModelInformationRow
            details={model}
            savedModelIds={savedIds}
            onSave={handleSaveModel}
            trainingFeatures={features}
          />

          {previousModels.map((details, idx) => (
            <ModelInformationRow
              key={idx}
              details={details}
              trainingFeatures={undefined}
            />
          ))}
        </Grid>
        <HStack>
          <Button
            onClick={handleNavigateToModel}
            variant="primary"
            rightIcon={<RiArrowRightLine />}
          >
            <FormattedMessage id="Use model" />
          </Button>
        </HStack>
      </VStack>
    </DefaultPageLayout>
  ) : (
    <></>
  );
};

export default EvaluateModelPage;
