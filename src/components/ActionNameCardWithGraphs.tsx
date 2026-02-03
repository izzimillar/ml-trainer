import { Card, HStack, Input, VStack } from "@chakra-ui/react";
import { ActionData } from "../model";
import { actionNameInputId } from "./ActionNameCard";
import RecordingGraph from "./RecordingGraph";
import { useIntl } from "react-intl";

interface ActionNameCardWithGraphsProps {
  action: ActionData;
}

const ActionNameCardWithGraphs = ({ action }: ActionNameCardWithGraphsProps) => {
  const graphWidth = 96;
  const graphHeight = 56;
  // const cardHeight = 8 + (graphHeight + 4) * (action.recordings.length);

  const intl = useIntl();
  return (
    <Card p={2}>
      <HStack>
        <Input
          id={actionNameInputId(action)}
          isTruncated
          value={action.name}
          borderWidth={0}
          maxLength={18}
          bgColor="gray.25"
          size="sm"
          _placeholder={{ opacity: 0.8, color: "gray.900" }}
          aria-label={intl.formatMessage({
            id: "action-name-placeholder",
          })}
          placeholder={intl.formatMessage({
            id: "action-name-placeholder",
          })}          
        />

        <VStack spacing={2} >
          {action.recordings.map((recording, idx) => (
            <RecordingGraph key={idx} data={recording.data} w={graphWidth} h={graphHeight}/>
          ))}
        </VStack>

      </HStack>
    </Card>
  );
};

export default ActionNameCardWithGraphs;