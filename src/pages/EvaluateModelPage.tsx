import { useCallback, useEffect } from "react";
import DefaultPageLayout from "../components/DefaultPageLayout";
import { createFeaturesPageUrl, createTestingModelPageUrl } from "../urls";
import { useNavigate } from "react-router";
import { Button, HStack, VStack } from "@chakra-ui/react";
import { RiArrowRightLine } from "react-icons/ri";
import { FormattedMessage } from "react-intl";
import { useStore } from "../store";
import ModelInformationRow from "../components/ModelInformationRow";
import BackArrow from "../components/BackArrow";

const EvaluateModelPage = () => {
  const model = useStore((s) => s.modelDetails);
  const previousModels = useStore((s) => s.previousModels);
  const saveModel = useStore((s) => s.saveModel);
  // const allFeatures: Set<Filter> = mlSettings.includedFilters;
  // const features: Set<Filter> = useStore((s) => s.trainingFeatures);

  const savedIds = previousModels.map((model) => model.ID);

  const navigate = useNavigate();

  const handleNavigateToModel = useCallback(() => {
    navigate(createTestingModelPageUrl());
  }, [navigate]);

  const navigateToFeatures = useCallback(() => {
    navigate(createFeaturesPageUrl());
  }, [navigate]);

  const handleSaveModel = useCallback(() => {
    saveModel();
  }, [saveModel]);

  useEffect(() => {
    if (!model) {
      return navigateToFeatures();
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
          onClick={navigateToFeatures}
        >
          <FormattedMessage id="Choose features" />
        </Button>
      }
    >
      <VStack>
        <ModelInformationRow
          details={model}
          savedModelIds={savedIds}
          onSave={handleSaveModel}
        />

        {previousModels.map((details, idx) => (
          <ModelInformationRow key={idx} details={details} />
        ))}
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
