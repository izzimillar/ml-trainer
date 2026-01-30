import { Button, HStack } from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { useHasSufficientDataForTraining, useStore } from "../store";
import { useNavigate } from "react-router";
import { createTestingModelPageUrl } from "../urls";
import { FormattedMessage } from "react-intl";

const FeaturesPage = () => {
  const navigate = useNavigate();

  const trainModelFlowStart = useStore((s) => s.trainModelFlowStart);
  const handleNavigateToModel = useCallback(() => {
    navigate(createTestingModelPageUrl());
  }, [navigate]);
  const hasSufficientData = useHasSufficientDataForTraining();

  const trainButtonRef = useRef(null);

  return (
    <>
      <HStack>
        <Button
          ref={trainButtonRef}
          className={"train-model-button"}
          onClick={() => trainModelFlowStart(handleNavigateToModel)}
          variant={hasSufficientData ? "primary" : "secondary-disabled"}
        >
          <FormattedMessage id="train-model" />
        </Button>
      </HStack>
    </>
  );
};

export default FeaturesPage;
