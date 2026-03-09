import {
  Box,
  Button,
  Card,
  CardProps,
  Checkbox,
  Grid,
  GridItem,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  VStack,
} from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import ModelNameCard, { ModelNameCardViewMode } from "./ModelNameCard";
import { ModelDetails } from "../model";
import PercentageMeter from "./PercentageMeter";
import PercentageDisplay from "./PercentageDisplay";
import { Filter, mlSettings } from "../mlConfig";
import { useCallback, useState } from "react";
import { useStore } from "../store";

const cardCommonProps: Partial<CardProps> = {
  p: 2,
  h: "100%",
  display: "grid",
  borderWidth: 1,
  position: "relative",
  placeItems: "center",
};

interface ModelTrainRowProps {
  details: Partial<ModelDetails>;
  nameViewMode: ModelNameCardViewMode;
  selected?: boolean;
  onSelectRow?: () => void;
  onTrain?: () => void;
  trainButtonRef?: React.RefObject<HTMLButtonElement>;
}

const ModelTrainRow = ({
  details,
  nameViewMode,
  selected,
  onSelectRow,
  onTrain,
  trainButtonRef,
}: ModelTrainRowProps) => {
  const setFeatures = useStore((s) => s.setTrainingFeature);
  const allFeatures = mlSettings.includedFilters;
  const trainingFeatures: Set<Filter> = useStore((s) => s.trainingFeatures);
  const [split, setSplit] = useState<number>(details.testTrainSplit ?? 20);

  const handleIncludeOnChange = useCallback(
    (feature: Filter, e: React.ChangeEvent<HTMLInputElement>) => {
      setFeatures(feature, e.target.checked);
    },
    [setFeatures]
  );

  const accuracy = details
    ? details.testResults
      ? details.testResults.error
        ? 0
        : details.testResults.accuracy * 100
      : 0
    : 0;

  const testingSamplesNumber = useCallback(() => {
    return details.actions
      ? details.actions.reduce(
          (acc, action) => acc + Math.round(action.recordings.length * split/100),
          0
        )
      : 0;
  }, [split, details.actions]);

  const trainingSamplesNumber = useCallback(() => {
    return details.actions
      ? details.actions.reduce(
          (acc, action) => acc + (action.recordings.length),
          0
        ) - testingSamplesNumber()
      : 0;
  }, [testingSamplesNumber, details.actions]);

  return (
    <Box role="region" display="contents" h="100%">
      <GridItem>
        <ModelNameCard name={"Temp name"} id={1} viewMode={nameViewMode} />
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
          </Grid>
        </Card>
      </GridItem>

      <GridItem colSpan={2}>
        <Card
          {...cardCommonProps}
          borderColor={selected ? "brand.500" : "transparent"}
          onClick={onSelectRow}
        >
          <Grid
            templateRows={"repeat(2, 1fr)"}
            templateColumns={"repeat(2, 1fr)"}
            autoFlow={"row"}
            gap={5}
            w="100%"
            textAlign={"center"}
          >
            <GridItem>
              <FormattedMessage
                id={`${trainingSamplesNumber()} training samples`}
              />
            </GridItem>

            <GridItem>
              <FormattedMessage
                id={`${testingSamplesNumber()} testing samples`}
              />
            </GridItem>

            <GridItem colSpan={2}>
              <Slider
                defaultValue={details.testTrainSplit ?? 0 * 100}
                onChange={setSplit}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </GridItem>
          </Grid>
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
          {onTrain && (
            <Button ref={trainButtonRef} variant={"primary"} onClick={onTrain}>
              <FormattedMessage id="Train model" />
            </Button>
          )}
        </Card>
      </GridItem>
    </Box>
  );
};

export default ModelTrainRow;
