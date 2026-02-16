import { Button, Flex, HStack } from "@chakra-ui/react";
import DefaultPageLayout, {
  ProjectMenuItems,
  ProjectToolbarItems,
} from "../components/DefaultPageLayout";
import FeaturesTable from "../components/FeaturesTable";
import { FormattedMessage } from "react-intl";
import { useHasSufficientDataForTraining, useStore } from "../store";
import { useNavigate } from "react-router";
import { useCallback, useRef } from "react";
import { createDataSamplesPageUrl, createTestingModelPageUrl } from "../urls";
import { RiArrowRightLine } from "react-icons/ri";
import BackArrow from "../components/BackArrow";
import LiveGraphPanel from "../components/LiveGraphPanel";
import TrainModelDialogs from "../components/TrainModelFlowDialogs";

const FeaturesPage = () => {
  // store
  const model = useStore((s) => s.model);
  const trainModelFlowStart = useStore((s) => s.trainModelFlowStart);

  const hasSufficientData = useHasSufficientDataForTraining();

  // navigation
  const navigate = useNavigate();

  const handleNavigateToModel = useCallback(() => {
    navigate(createTestingModelPageUrl());
  }, [navigate]);

  const trainButtonRef = useRef(null);

  const navigateToDataSamples = useCallback(() => {
    navigate(createDataSamplesPageUrl());
  }, [navigate]);

  return (
    <>
      <TrainModelDialogs finalFocusRef={trainButtonRef} />
      <DefaultPageLayout
        // localise this
        titleId="features"
        showPageTitle
        menuItems={<ProjectMenuItems />}
        toolbarItemsRight={<ProjectToolbarItems />}
        toolbarItemsLeft={
          <Button
            leftIcon={<BackArrow />}
            variant="toolbar"
            onClick={navigateToDataSamples}
          >
            <FormattedMessage id="back-to-data-samples-action" />
          </Button>
        }
      >
        <Flex as="main" flexGrow={1} flexDir="column">
          <FeaturesTable />
        </Flex>

        <HStack
          role="region"
          justifyContent="right"
          px={5}
          py={2}
          w="full"
          borderBottomWidth={3}
          borderTopWidth={3}
          borderColor="gray.200"
          alignItems="center"
        >
          <HStack>
            {model ? (
              <Button
                onClick={handleNavigateToModel}
                // className={tourElClassname.trainModelButton}
                variant="primary"
                rightIcon={<RiArrowRightLine />}
              >
                <FormattedMessage id="testing-model-title" />
              </Button>
            ) : (
              <Button
                ref={trainButtonRef}
                // className={tourElClassname.trainModelButton}
                onClick={() => trainModelFlowStart(handleNavigateToModel)}
                variant={hasSufficientData ? "primary" : "secondary-disabled"}
              >
                <FormattedMessage id="train-model" />
              </Button>
            )}
          </HStack>
        </HStack>
      </DefaultPageLayout>
    </>
  );
};

export default FeaturesPage;
