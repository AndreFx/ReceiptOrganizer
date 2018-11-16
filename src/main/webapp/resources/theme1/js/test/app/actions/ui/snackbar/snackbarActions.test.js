import * as actions from "../../../../../app/actions/ui/snackbar/snackbarActions";
import * as constants from "../../../../../common/constants";

describe("snackbarActions", function() {
  describe("processSnackbarQueue", function() {
    it("should create an action to process the snackbar queue", function() {
      const expectedAction = {
        type: actions.PROCESS_SNACKBAR_QUEUE
      };

      expect(actions.processSnackbarQueue()).toEqual(expectedAction);
    });
  });

  describe("finishCurrentSnackbar", function() {
    it("should create an action to finish the current snackbar", function() {
      const expectedAction = {
        type: actions.FINISH_CURRENT_SNACKBAR
      };

      expect(actions.finishCurrentSnackbar()).toEqual(expectedAction);
    });
  });

  describe("addSnackbar", function() {
    it("should create an action to add a new snackbar to the queue", function() {
      const handler = (param) => {
        return param;
      };
      const newSnackbar = {
        message: "Success!",
        variant: constants.SUCCESS_SNACKBAR,
        actions: [constants.SNACKBAR_ACTION_RETRY],
        handlers: [handler],
        handlerParams: [["SomeParam"]]
      };
      const expectedAction = {
        type: actions.ADD_SNACKBAR,
        newSnackbar: newSnackbar
      };

      expect(actions.addSnackbar(newSnackbar)).toEqual(expectedAction);
    });
  });
});
