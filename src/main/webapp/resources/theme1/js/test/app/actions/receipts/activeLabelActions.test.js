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
      const success = true;
      const receipts = [];
      const numPages = 0;
      const numReceipts = 0;
      const expectedAction = {
        type: actions.RECEIVE_ADD_ACTIVE_LABEL,
        label: label,
        receipts: receipts,
        numPages: numPages,
        numReceipts: numReceipts,
        success: success
      };

      expect(
        actions.receiveAddActiveLabel(
          label,
          receipts,
          numPages,
          numReceipts,
          success
        )
      ).toEqual(expectedAction);
    });
  });

  describe("receiveEditActiveLabel", function() {
    it("should create an action to notify an active label was edited", function() {
      const newLabel = { name: "NewActiveLabel" };
      const oldLabel = { name: "OldLabel" };
      const success = true;
      const expectedAction = {
        type: actions.RECEIVE_EDIT_ACTIVE_LABEL,
        newLabel: newLabel,
        oldLabel: oldLabel,
        success: success
      };

      expect(
        actions.receiveEditActiveLabel(newLabel, oldLabel, success)
      ).toEqual(expectedAction);
    });
  });

  describe("receiveRemoveActiveLabel", function() {
    it("should create an action to notify an active label was edited", function() {
      const label = { name: "NewActiveLabel" };
      const success = true;
      const receipts = [{ title: "Some Receipt" }];
      const numReceipts = 1;
      const numPages = 1;
      const expectedAction = {
        type: actions.RECEIVE_REMOVE_ACTIVE_LABEL,
        label: label,
        receipts: receipts,
        numReceipts: numReceipts,
        numPages: numPages,
        success: success
      };

      expect(
        actions.receiveRemoveActiveLabel(
          label,
          receipts,
          numReceipts,
          numPages,
          success
        )
      ).toEqual(expectedAction);
    });
  });
});
