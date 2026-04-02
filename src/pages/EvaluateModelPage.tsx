import { useCallback, useRef, useState } from "react";
import DefaultPageLayout from "../components/DefaultPageLayout";
import { createDataSamplesPageUrl, createTestingModelPageUrl } from "../urls";
import { useNavigate } from "react-router";
import {
  Button,
  Flex,
  Grid,
  GridProps,
  HStack,
  VStack,
} from "@chakra-ui/react";
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
import { ModelDetails } from "../model";

const gridCommonProps: Partial<GridProps> = {
  gridTemplateColumns: "200px 240px 200px 200px 340px 150px",
  gap: 3,
  px: 5,
  w: "100%",
};

const trainRowGridCommonProps: Partial<GridProps> = {
  gridTemplateColumns: "200px 240px 200px 200px 150px",
  gap: 3,
  px: 5,
  w: "100%",
};

const headings: GridColumnHeadingItemProps[] = [
  {
    titleId: "Model name",
    descriptionId: "Give your model a name!",
  },
  {
    titleId: "Features",
    descriptionId:
      'The data features that this model is trained on. To find out more about data features go to the "Explore data" page.',
  },
  {
    titleId: "Training size",
    descriptionId: "The number of recordings that the model was trained on.",
  },
  {
    titleId: "Test size",
    descriptionId: "The number of recordings that the model was tested on.",
  },
  {
    titleId: "Accuracy",
    descriptionId:
      "The accuracy of the model on the test data. A higher accuracy means the model is better at predicting your movement. We need the test size to be more than zero to calculate an accuracy.",
  },
  {},
];

const EvaluateModelPage = () => {
  const previousModels = useStore((s) => s.previousModels);
  const trainModelFlowStart = useStore((s) => s.trainModelFlowStart);
  const setModel = useStore((s) => s.setModelForUse);
  const deleteModel = useStore((s) => s.deleteModel);
  const [modelName, setModelName] = useState<string>("New model!");
  const [split, setSplit] = useState<number>(80);
  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(0);

  const selectedModel: ModelDetails =
    previousModels[selectedModelIdx] ?? previousModels[0];

  const trainButtonRef = useRef(null);
  const navigate = useNavigate();

  const selectedModelName = () => {
    if (previousModels.length === 0) {
      return "model";
    } else {
      return previousModels[selectedModelIdx].name;
    }
  };

  const handleDeleteModel = (id: ModelDetails["ID"]) => {
    if (selectedModelIdx >= previousModels.length - 1) {
      setSelectedModelIdx(previousModels.length - 2);
    }

    deleteModel(id);
  };

  const handleNavigateToModel = useCallback(() => {
    if (previousModels.length === 0) {
      return;
    }
    // set the model to the selected model idx for using it
    setModel(previousModels[selectedModelIdx].ID);

    navigate(createTestingModelPageUrl());
  }, [navigate, previousModels, setModel, selectedModelIdx]);

  const navigateToDataSamples = useCallback(() => {
    navigate(createDataSamplesPageUrl());
  }, [navigate]);

  return (
    <>
      <TrainModelDialogs
        finalFocusRef={trainButtonRef}
        modelDetails={{ name: modelName, trainingSize: split / 100 }}
      />
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
        <Flex as="main" flexGrow={1} flexDir="column" overflow="hidden">
          <HeadingGrid
            position="sticky"
            top={0}
            {...gridCommonProps}
            headings={headings}
          />
          <Grid
            {...gridCommonProps}
            py={2}
            alignItems="stretch"
            autoRows="max-content"
            overflow="auto"
            flexGrow={1}
            h={0}
          >
            {previousModels.map((details, idx) => {
              return (
                <ModelInformationRow
                  key={details.ID}
                  details={details}
                  nameViewMode={ModelNameCardViewMode.ReadOnly}
                  onSelectRow={() => setSelectedModelIdx(idx)}
                  selected={selectedModel.ID == details.ID}
                  onDelete={() => handleDeleteModel(details.ID)}
                />
              );
            })}
          </Grid>
        </Flex>

        <VStack>
          <HStack
            role="region"
            justifyContent="flex-end"
            px={5}
            py={2}
            w="full"
            borderBottomWidth={3}
            borderTopWidth={3}
            borderColor="gray.200"
            alignItems="center"
          >
            <Button
              onClick={handleNavigateToModel}
              variant={
                previousModels.length === 0 ? "secondary-disabled" : "primary"
              }
              rightIcon={<RiArrowRightLine />}
              disabled={previousModels.length === 0}
            >
              <FormattedMessage id={`Use ${selectedModelName()}`} />
            </Button>
          </HStack>

          <Flex as="main" flexGrow={1} flexDir="column">
            <Grid
              {...trainRowGridCommonProps}
              paddingBottom={2}
              h={152}
              alignItems="stretch"
              autoRows="max-content"
            >
              <ModelTrainRow
                name={modelName}
                setName={setModelName}
                split={split}
                setSplit={setSplit}
                nameViewMode={ModelNameCardViewMode.Editable}
                onTrain={() =>
                  trainModelFlowStart(undefined, {
                    name: modelName,
                    trainingSize: split / 100,
                  })
                }
                trainButtonRef={trainButtonRef}
              />
            </Grid>
          </Flex>
        </VStack>
      </DefaultPageLayout>
    </>
  );
};

export default EvaluateModelPage;
