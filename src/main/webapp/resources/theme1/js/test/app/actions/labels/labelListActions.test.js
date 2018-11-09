import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";

import * as actions from "../../../../app/actions/labels/labelListActions";
import * as constants from "../../../../common/constants";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("labelListActions", function() {
  describe("fetchLabels", function() {
    afterEach(function() {
      fetchMock.restore();
    });

    it("creates request and receive actions", function() {
      //Setup mock values
      const mockLabels = [{ name: "MyTestLabelName" }];
      const mockMsg = "Success";
      const expectedActions = [
        {
          type: actions.REQUEST_LABELS
        },
        {
          type: actions.RECEIVE_LABELS,
          labels: mockLabels,
          success: true,
          msg: mockMsg
        }
      ];

      //Setup fetch mock and store
      fetchMock.getOnce(
        "https://" + window.location.host + constants.GET_LABELS_PATH,
        {
          body: {
            labels: mockLabels,
            success: true,
            message: mockMsg
          },
          status: 200,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({ labels: [] });

      //Execute
      return store.dispatch(actions.fetchLabels()).then(function() {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
