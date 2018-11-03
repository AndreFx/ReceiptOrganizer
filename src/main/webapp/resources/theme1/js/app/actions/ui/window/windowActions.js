export const UPDATE_WINDOW_DIMENSIONS = "UPDATE_WINDOW_DIMENSIONS";

export function updateWindowDimensions(width, height) {
  return {
    type: UPDATE_WINDOW_DIMENSIONS,
    width: width,
    height: height
  };
}
