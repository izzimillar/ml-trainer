import {
  Box,
  Card,
  CardProps,
  Grid,
  GridItem,
  GridProps,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import ModelNameCard, { ModelNameCardViewMode } from "./ModelNameCard";
import { ModelDetails } from "../model";
import PercentageMeter from "./PercentageMeter";
import PercentageDisplay from "./PercentageDisplay";

const gridCommonProps: Partial<GridProps> = {
  gridTemplateColumns: "190px 360px 100px 100px auto",
  gap: 3,
  w: "100%",
};

const cardCommonProps: Partial<CardProps> = {
  p: 2,
  h: "120px",
  display: "flex",
  borderWidth: 1,
  position: "relative",
};

interface ModelInformationRowProps {
  details: ModelDetails;
  selected?: boolean;
  onSelectRow?: () => void;
  // trainingFeatures: Set<Filter>;
}

const ModelInformationRow = ({
  details,
  selected,
  onSelectRow,
}: ModelInformationRowProps) => {
  // const navigate = useNavigate();
  // const saveModel = useStore((s) => s.saveModel);

  // const navigateToFeatures = useCallback(() => {
  //   navigate(createFeaturesPageUrl());
  // }, [navigate]);

  // useEffect(() => {
  //   if (!currentModel) {
  //     return navigateToFeatures();
  //   }
  // });

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

  const accuracy = details ? 
    details.testResults ? 
      details.testResults.error ? 
        0 : details.testResults.accuracy * 100
      : 0
    : 0;

  // const modelIsSaved = previousModels.reduce(
  //   (found, details) => found || details.ID === currentModel?.ID,
  //   false
  // );

  // const handleSaveModel = useCallback(() => {
  //   saveModel();
  // }, [saveModel]);

  return (
    <Grid {...gridCommonProps}>
      <Box role="region" display="contents">
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
            // opacity={disabled ? 0.5 : undefined}
            // variant={
            //   viewMode === ModelNameCardViewMode.Preview ? "outline" : undefined
            // }
          >
            <HStack
              align={"center"}
              alignItems={"center"}
              alignContent={"center"}
            >
              {Array.from(details.trainingFeatures).map((feature, idx) => (
                <HStack key={idx}>
                  <FormattedMessage id={feature} />
                </HStack>
              ))}
            </HStack>
          </Card>
        </GridItem>

        <GridItem>
          <Card
            {...cardCommonProps}
            borderColor={selected ? "brand.500" : "transparent"}
            onClick={onSelectRow}
          >
            <FormattedMessage id={`${numberOfTrainingSamples()} training`} />
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
                id={`${details.testSampleIds.length} testing`}
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

              <PercentageDisplay
                value={accuracy}
                colorScheme={"brand2.500"}
              />
            </HStack>
          </Card>
        </GridItem>
      </Box>
    </Grid>
    // <Grid templateColumns={`repeat(4, auto)`} templateRows={"repeat(2, 1fr)"}>
    //   <GridItem>
    //     <Card>
    //       <FormattedMessage id="Model name" />
    //     </Card>
    //   </GridItem>

    //   <GridItem>
    //     <Card>
    //       <FormattedMessage id={"features"} />
    //     </Card>
    //   </GridItem>

    //   <GridItem>
    //     <Card>
    //       <FormattedMessage id="Number of samples trained on" />
    //     </Card>
    //   </GridItem>

    //   <GridItem>
    //     <Card>
    //       <FormattedMessage id="accuracy" />
    //     </Card>
    //   </GridItem>

    //   <GridItem>
    //     <Card>
    //       <FormattedMessage id={currentModel.name} />
    //     </Card>
    //   </GridItem>

    //   <GridItem>
    //     <Card>
    //       {Array.from(trainingFeatures).map((feature, idx) => (
    //         <VStack key={idx}>
    //           <FormattedMessage id={feature} />
    //         </VStack>
    //       ))}
    //     </Card>
    //   </GridItem>

    //   <GridItem>
    //     <Card>
    //       <FormattedMessage
    //         id={`number: ${
    //           numberOfTrainingSamples() - currentModel.testSampleIds.length
    //         }`}
    //       />
    //     </Card>
    //   </GridItem>

    //   <GridItem>
    //     <Card>
    //       <FormattedMessage id={`accuracy: ${accuracy()}%`} />
    //     </Card>
    //   </GridItem>

    //   <GridItem>
    //     <Button
    //       variant={"primary"}
    //       // leftIcon={<RiAddLine />}
    //       onClick={handleSaveModel}
    //       isDisabled={modelIsSaved}
    //     >
    //       <FormattedMessage id="Save model" />
    //     </Button>
    //   </GridItem>
    // </Grid>
  );
};

export default ModelInformationRow;
