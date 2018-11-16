import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";

import fetchService from "../../../../common/utils/fetchService";
import * as actions from "../../../../app/actions/labels/labelListActions";
import * as snackbarActions from "../../../../app/actions/ui/snackbar/snackbarActions";
import * as constants from "../../../../common/constants";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("labelListActions", function() {
  const mockCSRFHeaderName = "CSRF_TOKEN";
  const mockCSRFToken = "MY_RANDOM_CSRF_TOKEN";

  describe("fetchLabels", function() {
    afterEach(function() {
      fetchMock.restore();
    });

    it("creates REQUEST and RECEIVE actions on success", function() {
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

      return store.dispatch(actions.fetchLabels()).then(function() {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("creates an error snackbar on failure", function() {
      const expectedActions = [
        {
          type: actions.REQUEST_LABELS
        },
        {
          type: actions.RECEIVE_LABELS,
          labels: null,
          success: false,
          msg: constants.SERVER_ERROR
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: {
            msg: constants.SERVER_ERROR,
            variant: constants.ERROR_SNACKBAR,
            actions: [],
            handlers: [],
            handlerParams: [],
            autohideDuration: constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT
          }
        }
      ];

      fetchMock.getOnce(
        "https://" + window.location.host + constants.GET_LABELS_PATH,
        {
          body: {
            success: false
          },
          status: 404,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({ labels: [] });

      return store.dispatch(actions.fetchLabels()).then(function() {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("handles errors in response processing", function() {
      const mockLabels = [{ name: "MyTestLabelName" }];
      const mockMsg = "Success";
      const expectedActions = [
        {
          type: actions.REQUEST_LABELS
        },
        {
          type: actions.RECEIVE_LABELS,
          labels: null,
          success: false,
          msg: constants.SERVER_ERROR
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: {
            msg: constants.SERVER_ERROR,
            variant: constants.ERROR_SNACKBAR,
            actions: [],
            handlers: [],
            handlerParams: [],
            autohideDuration: constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT
          }
        }
      ];

      const spy = jest
        .spyOn(fetchService, "checkResponseStatus")
        .mockImplementation(() => {
          throw new Error("Unable to parse response");
        });
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

      return store.dispatch(actions.fetchLabels()).then(function() {
        expect(store.getActions()).toEqual(expectedActions);

        //Remove mock implementation
        spy.mockRestore();
      });
    });
  });

  describe("addLabel", function() {
    afterEach(function() {
      fetchMock.restore();
    });

    it("creates REQUEST and RECEIVE actions on success", function() {
      const mockLabel = { name: "MyTestLabelName" };
      const mockMsg = "Success";
      const expectedState = { labels: [mockLabel] };
      const expectedActions = [
        {
          type: actions.REQUEST_ADD_LABEL
        },
        {
          type: actions.RECEIVE_ADD_LABEL,
          label: mockLabel,
          success: true,
          msg: mockMsg
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: {
            actions: [],
            handlers: [],
            autohideDuration: constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
            handlerParams: [],
            msg: mockMsg,
            variant: constants.SUCCESS_SNACKBAR
          }
        }
      ];

      fetchMock.postOnce(
        "https://" + window.location.host + constants.ADD_LABEL_PATH,
        {
          body: {
            success: true,
            message: mockMsg
          },
          status: 200,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({ labels: [] });

      return store
        .dispatch(
          actions.addLabel(
            mockLabel,
            [],
            [],
            constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
            mockCSRFHeaderName,
            mockCSRFToken
          )
        )
        .then(function() {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("creates an error snackbar on failure", function() {
      const mockLabel = { name: "MyTestLabelName" };
      let dummyHandler = function(param) {
        return null;
      };
      const expectedActions = [
        {
          type: actions.REQUEST_ADD_LABEL
        },
        {
          type: actions.RECEIVE_ADD_LABEL,
          label: mockLabel,
          success: false,
          msg: constants.SERVER_ERROR
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: {
            msg: constants.SERVER_ERROR,
            variant: constants.ERROR_SNACKBAR,
            actions: ["Retry"],
            handlers: [dummyHandler],
            handlerParams: [[mockLabel.name]],
            autohideDuration: constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT
          }
        }
      ];

      fetchMock.postOnce(
        "https://" + window.location.host + constants.ADD_LABEL_PATH,
        {
          body: {
            success: false
          },
          status: 404,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({ labels: [] });

      return store
        .dispatch(
          actions.addLabel(
            mockLabel,
            ["Retry"],
            [dummyHandler],
            constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
            mockCSRFHeaderName,
            mockCSRFToken
          )
        )
        .then(function() {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("handles errors in response processing", function() {
      const mockLabel = { name: "MyTestLabelName" };
      const mockMsg = "Success";
      let dummyHandler = function(param) {
        return null;
      };
      const expectedActions = [
        {
          type: actions.REQUEST_ADD_LABEL
        },
        {
          type: actions.RECEIVE_ADD_LABEL,
          label: mockLabel,
          success: false,
          msg: constants.SERVER_ERROR
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: {
            msg: constants.SERVER_ERROR,
            variant: constants.ERROR_SNACKBAR,
            actions: ["Retry"],
            handlers: [dummyHandler],
            handlerParams: [[mockLabel.name]],
            autohideDuration: constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT
          }
        }
      ];

      const spy = jest
        .spyOn(fetchService, "checkResponseStatus")
        .mockImplementation(() => {
          throw new Error("Unable to parse response");
        });
      fetchMock.postOnce(
        "https://" + window.location.host + constants.ADD_LABEL_PATH,
        {
          body: {
            label: mockLabel,
            success: true,
            message: mockMsg
          },
          status: 200,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({ labels: [] });

      return store
        .dispatch(
          actions.addLabel(
            mockLabel,
            ["Retry"],
            [dummyHandler],
            constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
            mockCSRFHeaderName,
            mockCSRFToken
          )
        )
        .then(function() {
          expect(store.getActions()).toEqual(expectedActions);
          spy.mockRestore();
        });
    });
  });

  describe("deleteLabel", function() {
    afterEach(function() {
      fetchMock.restore();
    });

    it("creates REQUEST and RECEIVE actions on delete success", function() {
      const mockLabel = { name: "MyTestLabelName" };
      const mockMsg = "Success";
      const expectedActions = [
        {
          type: actions.REQUEST_DELETE_LABEL
        },
        {
          type: actions.RECEIVE_DELETE_LABEL,
          label: mockLabel,
          success: true,
          msg: mockMsg
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: {
            actions: [],
            handlers: [],
            autohideDuration: constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
            handlerParams: [],
            msg: mockMsg,
            variant: constants.SUCCESS_SNACKBAR
          }
        }
      ];

      fetchMock.postOnce(
        "https://" + window.location.host + constants.DELETE_LABEL_PATH,
        {
          body: {
            success: true,
            message: mockMsg
          },
          status: 200,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({ labels: [] });

      return store
        .dispatch(
          actions.deleteLabel(mockLabel, mockCSRFHeaderName, mockCSRFToken)
        )
        .then(function() {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("creates an error snackbar on failure", function() {
      const mockLabel = { name: "MyTestLabelName" };
      const expectedActions = [
        {
          type: actions.REQUEST_DELETE_LABEL
        },
        {
          type: actions.RECEIVE_DELETE_LABEL,
          label: mockLabel,
          success: false,
          msg: constants.SERVER_ERROR
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: {
            msg: constants.SERVER_ERROR,
            variant: constants.ERROR_SNACKBAR,
            actions: [],
            handlers: [],
            handlerParams: [],
            autohideDuration: constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT
          }
        }
      ];

      fetchMock.postOnce(
        "https://" + window.location.host + constants.DELETE_LABEL_PATH,
        {
          body: {
            success: false
          },
          status: 404,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({ labels: [] });

      return store
        .dispatch(
          actions.deleteLabel(mockLabel, mockCSRFHeaderName, mockCSRFToken)
        )
        .then(function() {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("handles errors in response processing", function() {
      const mockLabel = { name: "MyTestLabelName" };
      const mockMsg = "Success";
      const expectedActions = [
        {
          type: actions.REQUEST_DELETE_LABEL
        },
        {
          type: actions.RECEIVE_DELETE_LABEL,
          label: mockLabel,
          success: false,
          msg: constants.SERVER_ERROR
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: {
            msg: constants.SERVER_ERROR,
            variant: constants.ERROR_SNACKBAR,
            actions: [],
            handlers: [],
            handlerParams: [],
            autohideDuration: constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT
          }
        }
      ];

      const spy = jest
        .spyOn(fetchService, "checkResponseStatus")
        .mockImplementation(() => {
          throw new Error("Unable to parse response");
        });
      fetchMock.postOnce(
        "https://" + window.location.host + constants.DELETE_LABEL_PATH,
        {
          body: {
            label: mockLabel,
            success: true,
            message: mockMsg
          },
          status: 200,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({ labels: [] });

      return store
        .dispatch(
          actions.deleteLabel(mockLabel, mockCSRFHeaderName, mockCSRFToken)
        )
        .then(function() {
          expect(store.getActions()).toEqual(expectedActions);
          spy.mockRestore();
        });
    });
  });

  describe("editLabel", function() {
    afterEach(function() {
      fetchMock.restore();
    });

    it("creates REQUEST and RECEIVE actions on edit success", function() {
      const mockLabel = { name: "MyTestLabelName" };
      const newMockLabel = { name: "MyNewLabelName" };
      const mockMsg = "Success";
      const expectedActions = [
        {
          type: actions.REQUEST_EDIT_LABEL
        },
        {
          type: actions.RECEIVE_EDIT_LABEL,
          newLabel: newMockLabel,
          oldLabel: mockLabel,
          success: true,
          msg: mockMsg
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: {
            actions: [],
            handlers: [],
            autohideDuration: constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
            handlerParams: [],
            msg: mockMsg,
            variant: constants.SUCCESS_SNACKBAR
          }
        }
      ];

      fetchMock.postOnce(
        "https://" + window.location.host + constants.EDIT_LABEL_PATH,
        {
          body: {
            success: true,
            message: mockMsg
          },
          status: 200,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({ labels: [] });

      return store
        .dispatch(
          actions.editLabel(
            newMockLabel,
            mockLabel,
            [],
            [],
            constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
            mockCSRFHeaderName,
            mockCSRFToken
          )
        )
        .then(function() {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("creates an error snackbar on failure", function() {
      const mockLabel = { name: "MyTestLabelName" };
      const newMockLabel = { name: "MyNewLabelName" };
      const dummyFunc = function(param) {
        return null;
      };
      const expectedActions = [
        {
          type: actions.REQUEST_EDIT_LABEL
        },
        {
          type: actions.RECEIVE_EDIT_LABEL,
          oldLabel: mockLabel,
          newLabel: newMockLabel,
          success: false,
          msg: constants.SERVER_ERROR
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: {
            msg: constants.SERVER_ERROR,
            variant: constants.ERROR_SNACKBAR,
            actions: [constants.SNACKBAR_ACTION_RETRY],
            handlers: [dummyFunc],
            handlerParams: [[newMockLabel.name]],
            autohideDuration: constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT
          }
        }
      ];

      fetchMock.postOnce(
        "https://" + window.location.host + constants.EDIT_LABEL_PATH,
        {
          body: {
            success: false
          },
          status: 404,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({ labels: [] });

      return store
        .dispatch(
          actions.editLabel(
            newMockLabel,
            mockLabel,
            [constants.SNACKBAR_ACTION_RETRY],
            [dummyFunc],
            constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
            mockCSRFHeaderName,
            mockCSRFToken
          )
        )
        .then(function() {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("handles errors in response processing", function() {
      const mockLabel = { name: "MyTestLabelName" };
      const newMockLabel = { name: "MyNewLabelName" };
      const dummyFunc = function(param) {
        return null;
      };
      const mockMsg = "Success";
      const expectedActions = [
        {
          type: actions.REQUEST_EDIT_LABEL
        },
        {
          type: actions.RECEIVE_EDIT_LABEL,
          oldLabel: mockLabel,
          newLabel: newMockLabel,
          success: false,
          msg: constants.SERVER_ERROR
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: {
            msg: constants.SERVER_ERROR,
            variant: constants.ERROR_SNACKBAR,
            actions: [constants.SNACKBAR_ACTION_RETRY],
            handlers: [dummyFunc],
            handlerParams: [[newMockLabel.name]],
            autohideDuration: constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT
          }
        }
      ];

      const spy = jest
        .spyOn(fetchService, "checkResponseStatus")
        .mockImplementation(() => {
          throw new Error("Unable to parse response");
        });
      fetchMock.postOnce(
        "https://" + window.location.host + constants.EDIT_LABEL_PATH,
        {
          body: {
            success: true,
            message: mockMsg
          },
          status: 200,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({ labels: [] });

      return store
        .dispatch(
          actions.editLabel(
            newMockLabel,
            mockLabel,
            [constants.SNACKBAR_ACTION_RETRY],
            [dummyFunc],
            constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
            mockCSRFHeaderName,
            mockCSRFToken
          )
        )
        .then(function() {
          expect(store.getActions()).toEqual(expectedActions);
          spy.mockRestore();
        });
    });
  });
});
