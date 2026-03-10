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

const gridCommonProps: Partial<GridProps> = {
  gridTemplateColumns: "200px 240px 200px 200px 340px 150px",
  gap: 3,
  w: "100%",
  px: 5,
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
  const deleteModel = useStore((s) => s.deleteModel);
  const [modelName, setModelName] = useState<string>("New model!");
  const [split, setSplit] = useState<number>(80);
  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(0);

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
        <Flex as="main" flexGrow={1} flexDir="column">
          <VStack>
            <HeadingGrid
              position="sticky"
              top={0}
              px={5}
              {...gridCommonProps}
              headings={headings}
            />
            <Grid {...gridCommonProps}>
              {previousModels.map((details, idx) => (
                <ModelInformationRow
                  key={idx}
                  details={details}
                  nameViewMode={ModelNameCardViewMode.ReadOnly}
                  onSelectRow={() => setSelectedModelIdx(idx)}
                  selected={selectedModelIdx == idx}
                  onDelete={() => deleteModel(details.ID)}
                />
              ))}
            </Grid>
          </VStack>
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
              variant="primary"
              rightIcon={<RiArrowRightLine />}
            >
              <FormattedMessage id="Use model" />
            </Button>
          </HStack>
          <Grid {...gridCommonProps} paddingBottom={2} h={152}>
            <ModelTrainRow
              name={modelName}
              setName={setModelName}
              split={split}
              setSplit={setSplit}
              nameViewMode={ModelNameCardViewMode.Editable}
              onTrain={() =>
                trainModelFlowStart(handleSaveModel, {
                  name: modelName,
                  trainingSize: split / 100,
                })
              }
              trainButtonRef={trainButtonRef}
            />
          </Grid>
        </VStack>
      </DefaultPageLayout>
    </>
  );
};

export default EvaluateModelPage;
