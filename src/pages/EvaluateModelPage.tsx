import { useCallback, useRef } from "react";
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
import TrainModelDialogs from "../components/TrainModelFlowDialogs";
import { ModelNameCardViewMode } from "../components/ModelNameCard";
import ModelTrainRow from "../components/ModelTrainRow";
import { ModelDetails } from "../model";

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
  const previousModels = useStore((s) => s.previousModels);
  const trainModelFlowStart = useStore((s) => s.trainModelFlowStart);
  const saveModel = useStore((s) => s.saveModel);
  // const allFeatures: Set<Filter> = mlSettings.includedFilters;
  const features: Set<Filter> = useStore((s) => s.trainingFeatures);
  const actions = useStore((s) => s.actions);

  const pretrainedModelDetails: Partial<ModelDetails> = {
    name: "New model!",
    ID: Date.now(),
    trainingFeatures: features,
    actions: actions,
    testTrainSplit: 0.2,
  };

  // const savedIds = previousModels.map((model) => model.ID);

  const trainButtonRef = useRef(null);
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

  return (
    <>
      <TrainModelDialogs finalFocusRef={trainButtonRef} />
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
            <ModelTrainRow
              details={pretrainedModelDetails}
              nameViewMode={ModelNameCardViewMode.Editable}
              onTrain={() => trainModelFlowStart(handleSaveModel, true, 0.2)}
              trainingFeatures={features}
              trainButtonRef={trainButtonRef}
            />

            {previousModels.map((details, idx) => (
              <ModelInformationRow
                key={idx}
                details={details}
                nameViewMode={ModelNameCardViewMode.ReadOnly}
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
    </>
  );
};

export default EvaluateModelPage;
