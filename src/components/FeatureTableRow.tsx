import { GridItem } from "@chakra-ui/react";
import { XYZData } from "../model";
import { useStore } from "../store";
import { calculateGradientColor } from "../utils/gradient-calculator";
import { applyFilters } from "../ml";
import RecordingGraph from "./RecordingGraph";

interface FeaturesTableRowProps {
  data: XYZData;
}

const FeaturesTableRow = ({ data }: FeaturesTableRowProps) => {
  const dataWindow = useStore((s) => s.dataWindow);
  const dataFeatures = applyFilters(data, dataWindow, { normalize: true });

  return (
    <>
      <GridItem>
        <RecordingGraph data={data} h={56} w={96} />
      </GridItem>

      {Object.keys(dataFeatures).map((feature, idx) => (
        <GridItem key={idx}>
          <ColourBlock value={dataFeatures[feature]} />
        </GridItem>
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

export default FeaturesTableRow;
