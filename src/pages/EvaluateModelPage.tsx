import { useCallback, useEffect, useRef } from "react";
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

const gridCommonProps: Partial<GridProps> = {
  gridTemplateColumns: "100px",
  gap: 3,
  w: "100%",
};

const headings: GridColumnHeadingItemProps[] = [
  {
    titleId: "Model name",
  },
  // {
  //   titleId: "Features",
  // },
  // {
  //   titleId: "Training size",
  // },
  // {
  //   titleId: "Test size",
  // },
  // {
  //   titleId: "Accuracy",
  // },
];

const EvaluateModelPage = () => {
  const model = useStore((s) => s.modelDetails);
  const previousModels = useStore((s) => s.previousModels);
  const saveModel = useStore((s) => s.saveModel);
  // const allFeatures: Set<Filter> = mlSettings.includedFilters;
  // const features: Set<Filter> = useStore((s) => s.trainingFeatures);

  const savedIds = previousModels.map((model) => model.ID);

  const scrollableAreaRef = useRef<HTMLDivElement>(null);

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
          <FormattedMessage id="Choose features" />
        </Button>
      }
    >
      <VStack>
        <HeadingGrid
          position="sticky"
          top={0}
          {...gridCommonProps}
          headings={headings}
        />
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
