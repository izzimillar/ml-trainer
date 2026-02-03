import {
  Card,
  Grid,
  GridItem,
  GridProps,
  HStack,
  VStack,
} from "@chakra-ui/react";
import FeaturesTableRow from "./FeatureTableRow";
import { useStore } from "../store";
import { FormattedMessage } from "react-intl";
import { mlSettings } from "../mlConfig";

export const gridCommonProps: Partial<GridProps> = {
  gap: 3,
  px: 5,
  w: "100%",
};

const FeaturesTable = () => {
  const actions = useStore((s) => s.actions);

  return (
    <>
      {/* list of classes along the side, list of the features along the top*/}
      <Grid
        {...gridCommonProps}
        py={2}
        alignItems={"start"}
        autoRows={"max-content"}
        overflow={"auto"}
        flexGrow={1}
        h={0}
      >
        <GridItem>
          <HStack>
            {Array.from(mlSettings.includedFilters).map((filter, idx) => (
              <FeatureHeader key={idx} feature={filter} />
            ))}
          </HStack>
        </GridItem>

        {actions.map((action, idx) => (
          <FeaturesTableRow key={idx} action={action} />
        ))}
      </Grid>
    </>
  );
};

const FeatureHeader = ({ feature }: { feature: string }) => {
  // add tick box to this to allow/disable it
  return (
    <>
      <Card>
        <VStack>
          <FormattedMessage id={feature} />
          <HStack>
            <FormattedMessage id={`x`} />
            <FormattedMessage id={`y`} />
            <FormattedMessage id={`z`} />
          </HStack>
        </VStack>
      </Card>
    </>
  );
};

export default FeaturesTable;
