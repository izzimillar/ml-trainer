import { Card, Grid, GridItem } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Filter } from "../mlConfig";

interface ModelInformationRowProps {
  trainingFeatures: Set<Filter>;
}

const ModelInformationRow = ({ trainingFeatures }: ModelInformationRowProps) => {
  return (
    <Grid templateColumns={`repeat(4, auto)`}>
      <GridItem>
        <Card>
        <FormattedMessage id="Model name" />
        </Card>
      </GridItem>

      <GridItem>
        {Array.from(trainingFeatures).map((feature, idx) => (
          <Card key={idx}>
            <FormattedMessage id={feature} />
          </Card>
        ))}
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
