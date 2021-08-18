import { maxBy, minBy } from "lodash";

// Booted Off Of
// https://dev.to/ivanbtrujillo/fit-viewport-to-markers-using-react-map-gl-3ig1

export const getMinOrMax = (markers, minOrMax, latOrLng) => {
  if (minOrMax === "max") {
    return (maxBy(markers, value => (parseFloat(value[latOrLng]))))[latOrLng];
  } else {
    return (minBy(markers, value => (parseFloat(value[latOrLng]))))[latOrLng];
  }
};

export const getBounds = (markers) => {
    const maxLat = getMinOrMax(markers, "max", "lat");
    const minLat = getMinOrMax(markers, "min", "lat");
    const maxLng = getMinOrMax(markers, "max", "lng");
    const minLng = getMinOrMax(markers, "min", "lng");
  
    const southWest = [parseFloat(minLng), parseFloat(minLat)];
    const northEast = [parseFloat(maxLng), parseFloat(maxLat)];
    return [southWest, northEast];
};
  