import { Box, Card, Grid, GridItem, Text } from "@chakra-ui/react";
import ClickableTooltip from "./ClickableTooltip";
import { FormattedMessage } from "react-intl";
import { Filter } from "../mlConfig";

interface FeatureHeaderProps {
  feature: Filter;
  expanded: boolean;
  onClick: (feature: Filter) => void;
}

const FeatureHeader = ({ feature, expanded, onClick }: FeatureHeaderProps) => {
  const axes = ["x", "y", "z"];

  return (
    <>
      <Card
        h="100%"
        w="100%"
        p={2}
        display="flex"
        position="relative"
        onClick={() => onClick(feature)}
      >
        {expanded ? (
          <Grid>
            <GridItem textAlign={"center"} colSpan={3}>
              <FormattedMessage id={`${feature}`} />
            </GridItem>
            {axes.map((axis, idx) => (
              <GridItem
                key={idx}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gridRow={2}
              >
                <ClickableTooltip
                  placement="end-end"
                  label={
                    <Text p={3}>
                      <FormattedMessage
                        id={`fingerprint-${feature}-${axis}-tooltip`}
                      />
                    </Text>
                  }
                >
                  <FormattedMessage id={`${axis}`} />
                </ClickableTooltip>
              </GridItem>
            ))}
          </Grid>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="100%"
            h="100%"
            textAlign="center"
          >
            <FormattedMessage id={`${feature}`} />
          </Box>
        )}
      </Card>
    </>
  );
};

export default FeatureHeader;
