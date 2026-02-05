import { Card, Grid, GridItem, HStack, VStack } from "@chakra-ui/react";
import { calculateGradientColor } from "../utils/gradient-calculator";
import { useStore } from "../store";
import { getFeaturesFromAction } from "../feature-visualisation";
import { ActionData, XYZData } from "../model";
import { data } from "@tensorflow/tfjs";
import { applyFilters } from "../ml";

const FeaturesGraphic = ({ data }: { data: XYZData }) => {
  const dataWindow = useStore((s) => s.dataWindow);
  const dataFeatures = applyFilters(data, dataWindow, {
    normalize: true,
  });

  return (
    <>
      <HStack>
      {Object.keys(dataFeatures).map((feature, idx) => (
        <GridItem key={idx} rowSpan={dataFeatures[feature].count}>
          <ActionColourFeatureBlock values={dataFeatures[feature].x} />
          <ActionColourFeatureBlock values={dataFeatures[feature].y} />
          <ActionColourFeatureBlock values={dataFeatures[feature].z} />
        </GridItem>
      ))}
      </HStack>
    </>
  );
};

const ActionColourFeatureBlock = ({ values }: { values: number[] }) => {
  return (
    <>
      {values.map((value, i) => (
        <ColourBlock key={i} value={value} />
      ))}
    </>
  );
};

const ColourBlock = ({ value }: { value: number }) => {
  return (
    <GridItem
      h={"56px"}
      w="56px"
      backgroundColor={calculateGradientColor("#007DBC", value)}
    />
  );
};

export default FeaturesGraphic;
