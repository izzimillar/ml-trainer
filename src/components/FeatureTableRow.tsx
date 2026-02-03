import { Box, Card, GridItem, HStack, VStack } from "@chakra-ui/react";
import { ActionData } from "../model";
import { useStore } from "../store";
import { calculateGradientColor } from "../utils/gradient-calculator";
import { getFeaturesFromAction } from "../feature-visualisation";
import ActionNameCardWithGraphs from "./ActionNameCardWithGraphs";

interface FeaturesTableRowProps {
  action: ActionData;
}

const FeaturesTableRow = ({ action }: FeaturesTableRowProps) => {
  return (
    <>
      <Box>
        <HStack>
          <GridItem>
            <ActionNameCardWithGraphs action={action} />
          </GridItem>
          <GridItem h="100%">
            <FeaturesGraphic action={action} />
          </GridItem>
        </HStack>
      </Box>
    </>
  );
};

const FeaturesGraphic = ({ action }: { action: ActionData }) => {
  const dataWindow = useStore((s) => s.dataWindow);
  const dataFeatures = getFeaturesFromAction(action, dataWindow, {
    normalize: true,
  });

  return (
    <>
      <HStack w={`100%`} h="100%">
        {Object.keys(dataFeatures).map((feature, idx) => (
          <Card key={idx} flex={1} h="100%" w="100%">
            <HStack>
              <VStack w="100%">
                {dataFeatures[feature].x.map((value, i) => (
                  <GridItem
                    key={i}
                    h="100%"
                    w="100%"
                    backgroundColor={calculateGradientColor("#007DBC", value)}
                  />
                ))}
              </VStack>
              <VStack>
                {dataFeatures[feature].y.map((value, i) => (
                  <GridItem
                    key={i}
                    h="100%"
                    w="100%"
                    backgroundColor={calculateGradientColor("#007DBC", value)}
                  />
                ))}
              </VStack>
              <VStack>
                {dataFeatures[feature].z.map((value, i) => (
                  <GridItem
                    key={i}
                    h="100%"
                    w="100%"
                    backgroundColor={calculateGradientColor("#007DBC", value)}
                  />
                ))}
              </VStack>
            </HStack>
          </Card>
        ))}
      </HStack>
    </>
  );
};

export default FeaturesTableRow;
