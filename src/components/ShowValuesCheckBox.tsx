import { Checkbox } from "@chakra-ui/react";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { FeaturesView } from "../model";
import { useStore } from "../store";

const ShowValuesCheckbox = () => {
  const { featuresView, showValues, showFeatureGraph } = useStore(
    (s) => s.settings
  );
  const setFeaturesView = useStore((s) => s.setFeaturesView);
  const setShowValues = useStore((s) => s.setShowValues);
  const setShowGraph = useStore((s) => s.setShowFeatureGraph);

  const handleShowNumbersOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setShowValues(isChecked);
      setFeaturesView(
        isChecked ? FeaturesView.ColourAndValues : FeaturesView.Colour
      );
    },
    [setFeaturesView, setShowValues]
  );

  const handleShowFeatureGraphOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setShowGraph(isChecked);
      setFeaturesView(
        isChecked
          ? FeaturesView.Graph
          : showValues
          ? FeaturesView.ColourAndValues
          : FeaturesView.Colour
      );
    },
    [setFeaturesView, setShowGraph, showValues]
  );

  return (
    <>
      {featuresView !== FeaturesView.Graph && (
        <Checkbox isChecked={showValues} onChange={handleShowNumbersOnChange}>
          {/* TODO: localise this */}
          <FormattedMessage id="Show values" />
        </Checkbox>
      )}

      <Checkbox
        isChecked={showFeatureGraph}
        onChange={handleShowFeatureGraphOnChange}
      >
        <FormattedMessage id="Show graph" />
      </Checkbox>
    </>
  );
};

export default ShowValuesCheckbox;
