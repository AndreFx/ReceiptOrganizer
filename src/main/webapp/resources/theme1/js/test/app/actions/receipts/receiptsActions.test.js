import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";

import fetchService from "../../../../common/utils/fetchService";
import * as actions from "../../../../app/actions/receipts/receiptsActions";
import * as activeLabelActions from "../../../../app/actions/receipts/activeLabelsActions";
import * as snackbarActions from "../../../../app/actions/ui/snackbar/snackbarActions";
import * as constants from "../../../../common/constants";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("receiptsActions", function() {
  describe("updateActiveLabels", function() {

    afterEach(function() {
      fetchMock.restore();
    });

    it("creates REQUEST and RECEIVE actions for ADD_ACTIVE_LABEL", function() {
      const action =  constants.ADD_ACTIVE_LABEL;
      const label = { name: "NewActiveLabel" };
      const query = "";
      const currentPage = 1;
      const activeLabels = [];
      const mockMsg = "Success";
      
      const expectedActions = [
        {
          type: activeLabelActions.REQUEST_ADD_ACTIVE_LABEL
        },
        {
          type: activeLabelActions.RECEIVE_ADD_ACTIVE_LABEL,
          label: label,
          success: true,
          msg: mockMsg
        }
      ];

      fetchMock.getOnce(
        "https://" + window.location.host + constants.GET_RECEIPTS_PATH + "?activeLabelNames=NewActiveLabel",
        {
          body: {
            success: true,
            message: mockMsg
          },
          status: 200,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({ activeLabels: activeLabels });

      return store.dispatch(actions.updateActiveLabels(action, label, null, query, activeLabels, currentPage)).then(function() {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("creates REQUEST and RECEIVE actions for REMOVE_ACTIVE_LABEL", function() {
      const action =  constants.REMOVE_ACTIVE_LABEL;
      const label = { name: "NewActiveLabel" };
      const query = "";
      const currentPage = 1;
      const activeLabels = [ label ];
      const mockMsg = "Success";
      
      const expectedActions = [
        {
          type: activeLabelActions.REQUEST_REMOVE_ACTIVE_LABEL
        },
        {
          type: activeLabelActions.RECEIVE_REMOVE_ACTIVE_LABEL,
          label: label,
          success: true,
          msg: mockMsg
        }
      ];

      fetchMock.getOnce(
        "https://" + window.location.host + constants.GET_RECEIPTS_PATH,
        {
          body: {
            success: true,
            message: mockMsg
          },
          status: 200,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({ activeLabels: activeLabels });

      return store.dispatch(actions.updateActiveLabels(action, label, null, query, activeLabels, currentPage)).then(function() {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("creates REQUEST and RECEIVE actions for EDIT_ACTIVE_LABEL", function() {
      const action =  constants.EDIT_ACTIVE_LABEL;
      const newLabel = { name: "NewActiveLabel" };
      const oldLabel = { name: "OldActiveLabel" };
      const query = "";
      const currentPage = 1;
      const activeLabels = [ oldLabel ];
      const mockMsg = "Success";
      
      const expectedActions = [
        {
          type: activeLabelActions.REQUEST_EDIT_ACTIVE_LABEL
        },
        {
          type: activeLabelActions.RECEIVE_EDIT_ACTIVE_LABEL,
          newLabel: newLabel,
          oldLabel: oldLabel,
          success: true,
          msg: mockMsg
        }
      ];

      fetchMock.getOnce(
        "https://" + window.location.host + constants.GET_RECEIPTS_PATH + "?activeLabelNames=NewActiveLabel",
        {
          body: {
            success: true,
            message: mockMsg
          },
          status: 200,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({ activeLabels: activeLabels });

      return store.dispatch(actions.updateActiveLabels(action, oldLabel, newLabel, query, activeLabels, currentPage)).then(function() {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    //TODO: Test errors
  });
});
