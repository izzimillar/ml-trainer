import { useCallback } from "react";
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
  const model = useStore((s) => s.model);
  // const allFeatures: Set<Filter> = mlSettings.includedFilters;
  const features: Set<Filter> = useStore((s) => s.trainingFeatures);

  const navigate = useNavigate();

  const handleNavigateToModel = useCallback(() => {
    navigate(createTestingModelPageUrl());
  }, [navigate]);

  const navigateToFeatures = useCallback(() => {
    navigate(createFeaturesPageUrl());
  }, [navigate]);

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
        <ModelInformationRow trainingFeatures={features} />
        {/* <Grid templateColumns={`repeat(${allFeatures.size}, 1fr)`} gap={2}>
          {Array.from(allFeatures).map((feature, idx) => (
            <GridItem key={idx}>
              <Card key={idx} justifyContent="space-between" w="100%" alignItems={"center"}>
                <FormattedMessage id={feature} />
                <Checkbox isChecked={features.has(feature)}>
                  <FormattedMessage id="included" />
                </Checkbox>
              </Card>
            </GridItem>
          ))}
        </Grid> */}

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
