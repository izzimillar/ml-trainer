import { Grid, VStack } from "@chakra-ui/react";
import FeaturesTableRow from "./FeatureTableRow";
import { useStore } from "../store";

// interface FeaturesTableProps {
// }

const FeaturesTable = () => {
  const actions = useStore((s) => s.actions);

  return (
    <>
      {/* list of classes along the side, list of the features along the top*/}
      <Grid>
        {actions.map((action, idx) => (
          <FeaturesTableRow key={idx} action={action} />
        ))}
      </Grid>

      {/* list of features down the side 
        class to choose from at the top
        all the graphs from that class along the top underneath
        each feature shown in the correct position 
        highlight on the graph what this feature is when it is clicked on/mouse over?????
        */}
    </>
  );
};

export default FeaturesTable;
