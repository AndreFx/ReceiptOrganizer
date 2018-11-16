import * as actions from "../../../../../app/actions/ui/dialog/dialogActions";

describe("dialogActions", function() {
  describe("closeDialog", function() {
    it("should create an action to close the active dialog", function() {
      const expectedAction = {
        type: actions.CLOSE_DIALOG
      };

      expect(actions.closeDialog()).toEqual(expectedAction);
    });
  });

  describe("openDialog", function() {
    it("should create an action to open a dialog", function() {
      const submitHandler = () => {
        return "Submitted!";
      };
      const closeHandler = () => {
        return "Closed!";
      };
      const title = "MyDialog";
      const options = {
        dialogText: "Some text",
        textFields: [
          {
            label: "SomeTextFieldName",
            defaultValue: "Default"
          }
        ],
        cancelText: "Cancel!",
        submitText: "Submit!"
      };
      const expectedAction = {
        type: actions.OPEN_DIALOG,
        title: title,
        submit: submitHandler,
        close: closeHandler,
        options: options
      };

      expect(
        actions.openDialog(title, submitHandler, closeHandler, options)
      ).toEqual(expectedAction);
    });
  });
});
