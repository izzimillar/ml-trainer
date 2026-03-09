import {
  Box,
  Button,
  Card,
  CardProps,
  Checkbox,
  Grid,
  GridItem,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import ModelNameCard, { ModelNameCardViewMode } from "./ModelNameCard";
import { ModelDetails } from "../model";
import PercentageMeter from "./PercentageMeter";
import PercentageDisplay from "./PercentageDisplay";
import { Filter, mlSettings } from "../mlConfig";
import { useCallback } from "react";
import { useStore } from "../store";

const cardCommonProps: Partial<CardProps> = {
  p: 2,
  h: "100%",
  display: "grid",
  borderWidth: 1,
  position: "relative",
  placeItems: "center",
};

interface ModelInformationRowProps {
  details: ModelDetails;
  selected?: boolean;
  onSelectRow?: () => void;
  savedModelIds?: ModelDetails["ID"][];
  onSave?: () => void;
  onDelete?: () => void;
  trainingFeatures?: Set<Filter>;
}

const ModelInformationRow = ({
  details,
  selected,
  onSelectRow,
  savedModelIds,
  onSave,
  onDelete,
  trainingFeatures,
}: ModelInformationRowProps) => {
  const setFeatures = useStore((s) => s.setTrainingFeature);
  const allFeatures = mlSettings.includedFilters;

  const handleIncludeOnChange = useCallback(
    (feature: Filter, e: React.ChangeEvent<HTMLInputElement>) => {
      setFeatures(feature, e.target.checked);
    },
    [setFeatures]
  );

  const numberOfTrainingSamples = () => {
    if (details) {
      return (
        details.actions.reduce(
          (acc, action) => acc + action.recordings.length,
          0
        ) - details.testSampleIds.length
      );
    }
    return 0;
  };

  const accuracy = details
    ? details.testResults
      ? details.testResults.error
        ? 0
        : details.testResults.accuracy * 100
      : 0
    : 0;

  const modelIsSaved = savedModelIds?.includes(details.ID);

  return (
    <Box role="region" display="contents" h="100%">
      <GridItem>
        <ModelNameCard
          value={details}
          viewMode={ModelNameCardViewMode.Editable}
        />
      </GridItem>

      <GridItem>
        <Card
          {...cardCommonProps}
          borderColor={selected ? "brand.500" : "transparent"}
          onClick={onSelectRow}
        >
          <Grid
            templateColumns={"repeat(2, 1fr)"}
            autoFlow={"row"}
            gap={1}
            alignItems={"start"}
            justifyItems={"start"}
            w="100%"
          >
            {trainingFeatures &&
              Array.from(allFeatures).map((feature, idx) => (
                <VStack key={idx}>
                  <Checkbox
                    isChecked={trainingFeatures.has(feature)}
                    onChange={(e) => handleIncludeOnChange(feature, e)}
                  >
                    <FormattedMessage id={feature} />
                  </Checkbox>
                </VStack>
              ))}
            {!trainingFeatures &&
              Array.from(details.trainingFeatures).map((feature, idx) => (
                <VStack key={idx}>
                  <FormattedMessage id={feature} />
                </VStack>
              ))}
          </Grid>
        </Card>
      </GridItem>

      <GridItem>
        <Card
          {...cardCommonProps}
          borderColor={selected ? "brand.500" : "transparent"}
          onClick={onSelectRow}
        >
          <FormattedMessage
            id={`Trained on ${numberOfTrainingSamples()} samples`}
          />
        </Card>
      </GridItem>

      <GridItem>
        <Card
          {...cardCommonProps}
          borderColor={selected ? "brand.500" : "transparent"}
          onClick={onSelectRow}
        >
          <VStack>
            <FormattedMessage
              id={`Tested on ${details.testSampleIds.length} samples`}
            />
          </VStack>
        </Card>
      </GridItem>

      <GridItem>
        <Card
          {...cardCommonProps}
          borderColor={selected ? "brand.500" : "transparent"}
          onClick={onSelectRow}
        >
          <HStack w="100%" gap={5}>
            <PercentageMeter
              meterBarWidthPx={240}
              value={accuracy}
              colorScheme={"brand2.500"}
            />

            <PercentageDisplay value={accuracy} colorScheme={"brand2.500"} />
          </HStack>
        </Card>
      </GridItem>

      <GridItem>
        <Card
          {...cardCommonProps}
          borderColor={selected ? "brand.500" : "transparent"}
          onClick={onSelectRow}
        >
          {onSave && (
            <Button
              variant={"primary"}
              onClick={onSave}
              isDisabled={modelIsSaved}
            >
              <FormattedMessage id="Train model" />
            </Button>
          )}

          {onDelete && (
            <Button variant={"warning"} onClick={onDelete}>
              <FormattedMessage id="Delete model" />
            </Button>
          )}
        </Card>
      </GridItem>
    </Box>
  );
};

export default ModelInformationRow;
