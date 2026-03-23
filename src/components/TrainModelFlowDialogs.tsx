/**
 * (c) 2024, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { useCallback } from "react";
// import { useNavigate } from "react-router";
import { ModelDetails, TrainModelDialogStage } from "../model";
import { useSettings, useStore } from "../store";
// import { createTestAndTrainPageUrl } from "../urls";
import TrainingErrorDialog from "./TrainingErrorDialog";
import TrainingModelProgressDialog from "./TrainingModelProgressDialog";
import TrainModelIntroDialog from "./TrainModelHelpDialog";
import TrainModelInsufficientDataDialog from "./TrainModelInsufficientDataDialog";

interface TrainModelDialogsProps {
  finalFocusRef?: React.RefObject<HTMLButtonElement>;
  modelDetails?: Partial<ModelDetails>;
}

const TrainModelDialogs = ({ finalFocusRef, modelDetails }: TrainModelDialogsProps) => {
  const stage = useStore((s) => s.trainModelDialogStage);
  const closeTrainModelDialogs = useStore((s) => s.closeTrainModelDialogs);
  // const navigate = useNavigate();
  const trainModel = useStore((s) => s.trainModel);
  const trainModelProgress = useStore((s) => s.trainModelProgress);
  const [, setSettings] = useSettings();

  const handleHelpNext = useCallback(
    async (isSkipNextTime: boolean) => {
      setSettings({ showPreTrainHelp: !isSkipNextTime });
      await trainModel(modelDetails);
      // if (result) {
      //   navigate(createTestAndTrainPageUrl());
      // }
    },
    [setSettings, trainModel, modelDetails]
  );
  return (
    <>
      <TrainModelInsufficientDataDialog
        isOpen={stage === TrainModelDialogStage.InsufficientData}
        onClose={closeTrainModelDialogs}
        finalFocusRef={finalFocusRef}
      />
      <TrainModelIntroDialog
        isOpen={stage === TrainModelDialogStage.Help}
        onNext={handleHelpNext}
        onClose={closeTrainModelDialogs}
        finalFocusRef={finalFocusRef}
      />
      <TrainingErrorDialog
        isOpen={stage === TrainModelDialogStage.TrainingError}
        onClose={closeTrainModelDialogs}
        finalFocusRef={finalFocusRef}
      />
      <TrainingModelProgressDialog
        isOpen={stage === TrainModelDialogStage.TrainingInProgress}
        progress={trainModelProgress * 100}
        finalFocusRef={finalFocusRef}
      />
    </>
  );
};

export default TrainModelDialogs;
