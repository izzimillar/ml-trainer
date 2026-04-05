import {
  Card,
  CardBody,
  HStack,
  Input,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { ModelDetails } from "../model";
import { tourElClassname } from "../tours";
import debounce from "lodash.debounce";
import { useStore } from "../store";

export enum ModelNameCardViewMode {
  Editable = "Editable", // Interaction, color, depth
  ReadOnly = "Readonly", // Grayed out
  Preview = "Preview", // Flattened
}

interface ModelNameCardProps {
  model?: ModelDetails
  onSave?: (name: string) => void;
  onSelectRow?: () => void;
  selected?: boolean;
  viewMode: ModelNameCardViewMode;
  disabled?: boolean;
}

const modelNameMaxLength = 18;

const ModelNameCard = ({
  model,
  onSave,
  onSelectRow,
  selected = false,
  viewMode,
  disabled,
}: ModelNameCardProps) => {
  const intl = useIntl();
  const toast = useToast();
  const toastId = "name-too-long-toast";
  const setModelName = useStore((s) => s.setModelName);
  const [localName, setLocalName] = useState<string>(model?.name ?? "New model!");
  // Avoid autofocus on mobile as it triggers the keyboard
  const allowAutoFocus = useBreakpointValue({ base: false, md: true });

    const debouncedSetModelName = useMemo(
    () =>
      debounce(
        (id: ModelDetails["ID"], name: string) => {
          setModelName(id, name);
        },
        400,
        { leading: true }
      ),
    [setModelName]
  );


  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const name = e.target.value;
      // Validate action name length
      if (name.length >= modelNameMaxLength && !toast.isActive(toastId)) {
        toast({
          id: toastId,
          position: "top",
          duration: 5_000,
          title: intl.formatMessage(
            { id: "action-length-error" },
            { maxLen: modelNameMaxLength }
          ),
          variant: "subtle",
          status: "error",
        });
        return;
      }
      setLocalName(name);
      
      if (model) {
        debouncedSetModelName(model.ID, name);
      }
      if (onSave) {
        onSave(name);
      }

    },
    [setLocalName, onSave, debouncedSetModelName, model, intl, toast]
  );

  return (
    <Card
      p={2}
      h="100%"
      display="flex"
      borderColor={selected ? "brand.500" : "transparent"}
      borderWidth={1}
      onClick={onSelectRow}
      position="relative"
      className={tourElClassname.dataSamplesActionCard}
      opacity={disabled ? 0.5 : undefined}
      variant={
        viewMode === ModelNameCardViewMode.Preview ? "outline" : undefined
      }
    >

      <CardBody p={0} alignContent="center">
        <HStack>
          <Input
            id={localName}
            autoFocus={allowAutoFocus && localName.length === 0}
            isTruncated
            readOnly={viewMode !== ModelNameCardViewMode.Editable}
            value={localName}
            borderWidth={0}
            maxLength={18}
            {...(viewMode !== ModelNameCardViewMode.Editable
              ? { bgColor: "transparent", size: "lg" }
              : { bgColor: "gray.25", size: "sm" })}
            _placeholder={{ opacity: 0.8, color: "gray.900" }}
            onChange={onChange}
          />
        </HStack>
      </CardBody>
    </Card>
  );
};

export default ModelNameCard;
