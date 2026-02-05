import { Card, Grid, GridItem, HStack, Input, VStack } from "@chakra-ui/react";
import { ActionData } from "../model";
import { actionNameInputId } from "./ActionNameCard";
import RecordingGraph from "./RecordingGraph";
import { useIntl } from "react-intl";

interface ActionNameCardWithGraphsProps {
  action: ActionData;
}

const ActionNameCardWithGraphs = ({
  action,
}: ActionNameCardWithGraphsProps) => {
  const graphWidth = 96;
  const graphHeight = 56;
  // const cardHeight = 8 + (graphHeight + 4) * (action.recordings.length);

  const intl = useIntl();
  return (
    <Card
      p={2}
      display="flex"
      // borderColor={selected ? "brand.500" : "transparent"}
      borderWidth={1}
      // onClick={onSelectRow}
      position="relative"
      // className={tourElClassname.dataSamplesActionCard}
      // opacity={disabled ? 0.5 : undefined}
      // variant={
      //   viewMode === ActionCardNameViewMode.Preview ? "outline" : undefined
      // }
    >
      <HStack>
        <GridItem rowSpan={action.recordings.length}>
          <Input
            id={actionNameInputId(action)}
            isTruncated
            value={action.name}
            borderWidth={0}
            maxLength={18}
            bgColor="gray.25"
            size="sm"
            _placeholder={{ opacity: 0.8, color: "gray.900" }}
            placeholder={intl.formatMessage({
              id: "action-name-placeholder",
            })}
          />
        </GridItem>
        <VStack>
          {action.recordings.map((recording, idx) => (
            <GridItem key={idx}>
              <RecordingGraph
                key={idx}
                data={recording.data}
                w={graphWidth}
                h={graphHeight}
              />
            </GridItem>
          ))}
        </VStack>
      </HStack>
    </Card>
  );
};

export default ActionNameCardWithGraphs;
