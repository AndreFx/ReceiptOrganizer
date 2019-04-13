import * as actions from "../../../../../app/actions/ui/window/windowActions";

describe("windowActions", function() {
  describe("updateWindowDimensions", function() {
    it("should create an action to update the current window dimensions", function() {
      const width = 1000;
      const height = 1000;
      const expectedAction = {
        type: actions.UPDATE_WINDOW_DIMENSIONS,
        width: width,
        height: height
      };

      expect(actions.updateWindowDimensions(width, height)).toEqual(
        expectedAction
      );
    });
  });
});
