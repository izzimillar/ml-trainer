import { FormattedMessage } from "react-intl";
import { ActionData } from "../model";
import { Button, Menu, Text, VStack } from "@chakra-ui/react";
// import MoreMenuButton from "./MoreMenuButton";

interface DataAugmentationControlProps {
  action: ActionData;
  selected: boolean;
  onAugment: (action: ActionData, repeats?: number, mean?: number, stddev?: number) => void;
}

export const augmentButtonId = (action: ActionData) =>
  `augment-button-${action.ID}`;

const DataAugmentationControl = ({
  action,
  selected,
  onAugment,
  ...props
}: DataAugmentationControlProps) => {
  const disabled: boolean = action.recordings.length < 3;
  
  return (
    <VStack w="8.25rem" justifyContent="center" {...props}>
      <Menu>
        {/* <ButtonGroup isAttached> */}
        <Button
          id={augmentButtonId(action)}
          px={4}
          variant={disabled ? "secondary-disabled" : selected ? "primary" : "secondary"}
          onClick={() => onAugment(action, 1)}
        >
          <FormattedMessage id="Add data" />
        </Button>
        {/* <MoreMenuButton
            minW={8}
            variant={selected ? "record" : "recordOutline"}
          />
        </ButtonGroup> */}
      </Menu>
      {disabled ? (
        <Text
          fontSize="xs"
          textAlign="center"
          fontWeight="bold"
          userSelect="none"
        >
          <FormattedMessage id="data-samples-status-not-enough" />
        </Text>
      ) : (
        <Text fontSize="xs" textAlign="center" userSelect="none">
          <FormattedMessage
          // TODO: localise this
            // id="data-samples-status-count"
            id="Double samples!"
            values={{ numSamples: action.recordings.length }}
          />
        </Text>
      )}
    </VStack>
  );
};

export default DataAugmentationControl;
