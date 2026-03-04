import { Card, Grid, GridItem, VStack } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Filter } from "../mlConfig";
import { useStore } from "../store";
import { testModel } from "../ml";

interface ModelInformationRowProps {
  trainingFeatures: Set<Filter>;
}

const ModelInformationRow = ({
  trainingFeatures,
}: ModelInformationRowProps) => {
  const model = useStore((s) => s.model);

  return (
    <Grid templateColumns={`repeat(4, auto)`}>
      <GridItem>
        <Card>
          <FormattedMessage id="Model name" />
        </Card>
      </GridItem>

      <GridItem>
        <Card>
          {Array.from(trainingFeatures).map((feature, idx) => (
            <FormattedMessage key={idx} id={feature} />
          ))}
        </Card>
      </GridItem>

      <GridItem>
        <Card>
          <FormattedMessage id="Number of samples trained on" />
        </Card>
      </GridItem>

      <GridItem>
        <Card>
          <FormattedMessage id="accuracy" />
        </Card>
      </GridItem>
    </Grid>
  );
};

export default ModelInformationRow;
