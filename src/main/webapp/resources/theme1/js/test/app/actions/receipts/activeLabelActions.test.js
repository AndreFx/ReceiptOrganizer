import * as actions from "../../../../app/actions/receipts/activeLabelsActions";

describe("activeLabelsActions", function() {
  describe("requestAddActiveLabel", function() {
    it("should create an action to request adding an active label", function() {
      const expectedAction = {
        type: actions.REQUEST_ADD_ACTIVE_LABEL
      };

      expect(actions.requestAddActiveLabel()).toEqual(expectedAction);
    });
  });

  describe("requestEditActiveLabel", function() {
    it("should create an action to edit an active label", function() {
      const expectedAction = {
        type: actions.REQUEST_EDIT_ACTIVE_LABEL
      };

      expect(actions.requestEditActiveLabel()).toEqual(expectedAction);
    });
  });

  describe("requestRemoveActiveLabel", function() {
    it("should create an action to remove an active label", function() {
      const expectedAction = {
        type: actions.REQUEST_REMOVE_ACTIVE_LABEL
      };

      expect(actions.requestRemoveActiveLabel()).toEqual(expectedAction);
    });
  });

  describe("receiveAddActiveLabel", function() {
    it("should create an action to notify a new active label was added", function() {
      const label = { name: "NewActiveLabel" };
      const msg = "Success";
      const success = true;
      const expectedAction = {
        type: actions.RECEIVE_ADD_ACTIVE_LABEL,
        label: label,
        msg: msg,
        success: success
      };

      expect(actions.receiveAddActiveLabel(label, success, msg)).toEqual(
        expectedAction
      );
    });
  });

  describe("receiveEditActiveLabel", function() {
    it("should create an action to notify an active label was edited", function() {
      const newLabel = { name: "NewActiveLabel" };
      const oldLabel = { name: "OldLabel" };
      const msg = "Success";
      const success = true;
      const expectedAction = {
        type: actions.RECEIVE_EDIT_ACTIVE_LABEL,
        newLabel: newLabel,
        oldLabel: oldLabel,
        msg: msg,
        success: success
      };

      expect(
        actions.receiveEditActiveLabel(newLabel, oldLabel, success, msg)
      ).toEqual(expectedAction);
    });
  });

  describe("receiveRemoveActiveLabel", function() {
    it("should create an action to notify an active label was edited", function() {
      const label = { name: "NewActiveLabel" };
      const msg = "Success";
      const success = true;
      const expectedAction = {
        type: actions.RECEIVE_REMOVE_ACTIVE_LABEL,
        label: label,
        msg: msg,
        success: success
      };

      expect(actions.receiveRemoveActiveLabel(label, success, msg)).toEqual(
        expectedAction
      );
    });
  });
});
