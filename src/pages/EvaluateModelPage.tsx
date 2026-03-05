import { useCallback, useEffect } from "react";
import DefaultPageLayout from "../components/DefaultPageLayout";
import { createFeaturesPageUrl, createTestingModelPageUrl } from "../urls";
import { useNavigate } from "react-router";
import { Button, HStack, VStack } from "@chakra-ui/react";
import { RiArrowRightLine } from "react-icons/ri";
import { FormattedMessage } from "react-intl";
import { useStore } from "../store";
import { Filter } from "../mlConfig";
import ModelInformationRow from "../components/ModelInformationRow";
import BackArrow from "../components/BackArrow";

const EvaluateModelPage = () => {
  const model = useStore((s) => s.modelDetails);
  const previousModels = useStore((s) => s.previousModels);
  // const allFeatures: Set<Filter> = mlSettings.includedFilters;
  // const features: Set<Filter> = useStore((s) => s.trainingFeatures);

  const navigate = useNavigate();

  const handleNavigateToModel = useCallback(() => {
    navigate(createTestingModelPageUrl());
  }, [navigate]);

  const navigateToFeatures = useCallback(() => {
    navigate(createFeaturesPageUrl());
  }, [navigate]);

  useEffect(() => {
    if (!model) {
      return navigateToFeatures();
    }
  });

  return model ? (
    <DefaultPageLayout
      titleId="Evaluate model"
      showPageTitle
      toolbarItemsLeft={
        <Button
          leftIcon={<BackArrow />}
          variant="toolbar"
          onClick={navigateToFeatures}
        >
          <FormattedMessage id="Choose features" />
        </Button>
      }
    >
      <VStack>
        <ModelInformationRow details={model} />
        <HStack>
          <Button
            onClick={handleNavigateToModel}
            variant="primary"
            rightIcon={<RiArrowRightLine />}
          >
            <FormattedMessage id="testing-model-title" />
          </Button>
        </HStack>
      </VStack>
    </DefaultPageLayout>
  ) : (
    <></>
  );
};

export default EvaluateModelPage;
