import { useCallback } from "react";
import DefaultPageLayout from "../components/DefaultPageLayout";
import { createTestingModelPageUrl } from "../urls";
import { useNavigate } from "react-router";
import { Button } from "@chakra-ui/react";
import { RiArrowRightLine } from "react-icons/ri";
import { FormattedMessage } from "react-intl";

const EvaluateModelPage = () => {
  const navigate = useNavigate();

  const handleNavigateToModel = useCallback(() => {
    navigate(createTestingModelPageUrl());
  }, [navigate]);

  return (
    <DefaultPageLayout titleId="Evaluate model" showPageTitle>
      <Button
        onClick={handleNavigateToModel}
        variant="primary"
        rightIcon={<RiArrowRightLine />}
      >
        <FormattedMessage id="testing-model-title" />
      </Button>
    </DefaultPageLayout>
  );
};

export default EvaluateModelPage;
