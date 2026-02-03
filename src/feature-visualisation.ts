import { normalize } from "./ml";
import { getMlFilters, mlSettings } from "./mlConfig";
import { ActionData, XYZData } from "./model";
import { DataWindow } from "./store";



// Get a list of values for each feature from all the recordings of a single action --> this is how we want them displayed in the visualisation
export const getFeaturesFromAction = (
  action: ActionData, 
  dataWindow: DataWindow, 
  opts: { normalize?: boolean } = {}
): Record<string, XYZData> => {
  const features: Record<string, XYZData> = {};
  const filters = getMlFilters(dataWindow);
  
  // for each of the included filters
  Array.from(mlSettings.includedFilters).forEach((filter) => {
    const { strategy, min, max } = filters[filter];
    // go through each recording to get this value
    action.recordings.forEach((recording) => {
      const {x,y,z} = recording.data;
      // if we are normalizing the values
      if (opts.normalize) {
        if (!features[`${filter}`]) {
          features[`${filter}`] = { 
            x: [normalize(strategy(x, dataWindow), min, max)], 
            y: [normalize(strategy(y, dataWindow), min, max)], 
            z: [normalize(strategy(z, dataWindow), min, max)] 
          };
        } else {
          features[`${filter}`].x.push(
            normalize(strategy(x, dataWindow), min, max)
          );
          features[`${filter}`].y.push(
            normalize(strategy(y, dataWindow), min, max)
          );
          features[`${filter}`].z.push(
            normalize(strategy(z, dataWindow), min, max)
          );
        }
      } else {
        if (!features[`${filter}`]) {
          features[`${filter}`] = { 
            x: [strategy(x, dataWindow)], 
            y: [strategy(y, dataWindow)], 
            z: [strategy(z, dataWindow)] 
          };
        } else {
          features[`${filter}`].x.push(strategy(x, dataWindow));
          features[`${filter}`].y.push(strategy(y, dataWindow));
          features[`${filter}`].z.push(strategy(z, dataWindow));
        }
      }
    });
  });

  return features;
};



