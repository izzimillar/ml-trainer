import { Checkbox } from "@chakra-ui/react";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { FeaturesView } from "../model";
import { useStore } from "../store";

const ShowValuesCheckbox = () => {
  const { featuresView, showValues, showFeatureGraph, showGraphLines } =
    useStore((s) => s.settings);
  const setFeaturesView = useStore((s) => s.setFeaturesView);
  const setShowValues = useStore((s) => s.setShowValues);
  const setShowGraph = useStore((s) => s.setShowFeatureGraph);
  const setShowGraphLines = useStore((s) => s.setShowGraphLines);

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

  const handleShowGraphLinesOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setShowGraphLines(isChecked);
      setFeaturesView(
        isChecked
          ? FeaturesView.Graph
          : FeaturesView.GraphNoLines
      );
    },
    [setFeaturesView, setShowGraphLines]
  );

  return (
    <>
      {(featuresView === FeaturesView.ColourAndValues ||
        featuresView === FeaturesView.Colour) && (
        <Checkbox isChecked={showValues} onChange={handleShowNumbersOnChange}>
          {/* TODO: localise this */}
          <FormattedMessage id="Show values" />
        </Checkbox>
      )}

      {(featuresView === FeaturesView.Graph || featuresView === FeaturesView.GraphNoLines ) && (
        <Checkbox isChecked={showGraphLines} onChange={handleShowGraphLinesOnChange}>
          <FormattedMessage id="Show lines" />
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
