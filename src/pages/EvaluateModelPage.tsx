import { useCallback, useRef, useState } from "react";
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
import TrainModelDialogs from "../components/TrainModelFlowDialogs";
import { ModelNameCardViewMode } from "../components/ModelNameCard";
import ModelTrainRow from "../components/ModelTrainRow";
import { name } from "ejs";

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
  const [modelName, setModelName] = useState<string>("New model!");
  const [split, setSplit] = useState<number>(80);

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
              name={modelName}
              setName={setModelName}
              split={split}
              setSplit={setSplit}
              nameViewMode={ModelNameCardViewMode.Editable}
              onTrain={() =>
                trainModelFlowStart(handleSaveModel, {
                  name: name,
                  trainingSize: split/100,
                })
              }
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
