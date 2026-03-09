import {
  Box,
  Button,
  Card,
  CardProps,
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
  nameViewMode: ModelNameCardViewMode;
  selected?: boolean;
  onSelectRow?: () => void;
  onDelete?: () => void;
}

const ModelInformationRow = ({
  details,
  nameViewMode,
  selected,
  onSelectRow,
  onDelete,
}: ModelInformationRowProps) => {
  // const handleIncludeOnChange = useCallback(
  //   (feature: Filter, e: React.ChangeEvent<HTMLInputElement>) => {
  //     setFeatures(feature, e.target.checked);
  //   },
  //   [setFeatures]
  // );

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

  return (
    <Box role="region" display="contents" h="100%">
      <GridItem>
        <ModelNameCard
          name={details.name}
          setName={(_) => {}}
          viewMode={nameViewMode}
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
            {Array.from(details.trainingFeatures).map((feature, idx) => (
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
            id={`${numberOfTrainingSamples()} training samples`}
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
              id={`${details.testSampleIds.length} testing samples`}
            />
          </VStack>
        </Card>
      </GridItem>

      <GridItem>
        <Card
          {...cardCommonProps}
          borderColor={selected ? "brand.500" : "transparent"}
          onClick={onSelectRow}
          // TODO: edit this for if there's no testing data
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
