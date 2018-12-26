import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";

import * as actions from "../../../../app/actions/receipts/receiptsActions";
import * as activeLabelActions from "../../../../app/actions/receipts/activeLabelsActions";
import * as snackbarActions from "../../../../app/actions/ui/snackbar/snackbarActions";
import * as constants from "../../../../common/constants";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("receiptsActions", function() {
  const errorSnackbar = {
    msg: constants.SERVER_ERROR,
    variant: constants.ERROR_SNACKBAR,
    actions: [],
    handlers: [],
    handlerParams: [],
    autohideDuration: constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT
  };

  describe("queryReceipts action creators", function() {
    it("should create an action to request a receipt query", function() {
      const expectedAction = {
        type: actions.REQUEST_QUERY_RECEIPTS
      };

      expect(actions.requestQueryReceipts()).toEqual(expectedAction);
    });

    it("should create an action to receive a receipt query", function() {
      const query = "MyQuery";
      const receipts = [
        {
          title: "MyReceipts"
        }
      ];
      const numReceipts = 1;
      const numPages = 1;
      const expectedAction = {
        type: actions.RECEIVE_QUERY_RECEIPTS,
        receipts: receipts,
        numReceipts: numReceipts,
        numPages: numPages,
        query: query,
        success: true
      };

      expect(
        actions.receiveQueryReceipts(
          query,
          receipts,
          numReceipts,
          numPages,
          true
        )
      ).toEqual(expectedAction);
    });
  });

  describe("receiptPageLoad action creators", function() {
    it("should create an action to request a receipt page load", function() {
      const expectedAction = {
        type: actions.REQUEST_RECEIPT_PAGE_LOAD
      };

      expect(actions.requestReceiptPageLoad()).toEqual(expectedAction);
    });

    it("should create an action to receive a page load", function() {
      const receipts = [
        {
          title: "MyReceipts"
        }
      ];
      const pageNum = 1;
      const expectedAction = {
        type: actions.RECEIVE_RECEIPT_PAGE_LOAD,
        receipts: receipts,
        pageNum: pageNum,
        success: true
      };

      expect(actions.receiveReceiptPageLoad(pageNum, receipts, true)).toEqual(
        expectedAction
      );
    });
  });

  describe("addActiveLabel", function() {
    afterEach(function() {
      fetchMock.restore();
    });

    it("creates REQUEST and RECEIVE actions for ADD_ACTIVE_LABEL", function() {
      const label = { name: "NewActiveLabel" };
      const activeLabels = [];
      const mockMsg = "Success";

      const expectedActions = [
        {
          type: activeLabelActions.REQUEST_ADD_ACTIVE_LABEL
        },
        {
          type: activeLabelActions.RECEIVE_ADD_ACTIVE_LABEL,
          label: label,
          receipts: [],
          numPages: 0,
          numReceipts: 0,
          success: true
        }
      ];

      fetchMock.getOnce(
        constants.HOST_URL +
          constants.GET_RECEIPTS_PATH +
          "?activeLabelNames=NewActiveLabel",
        {
          body: {
            success: true,
            message: mockMsg,
            receipts: [],
            totalNumReceipts: 0,
            numPages: 0
          },
          status: 200,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({
        activeLabels: {
          items: activeLabels
        },
        receipts: {
          query: "",
          currentPage: 0,
          numPages: 0,
          totalNumReceipts: 0,
          items: [],
          isLoading: false
        }
      });

      return store.dispatch(actions.addActiveLabel(label)).then(function() {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("creates REQUEST, RECEIVE and ADD_SNACKBAR actions for an unsuccessful ADD_ACTIVE_LABEL", function() {
      const label = { name: "NewActiveLabel" };
      const activeLabels = [];
      const mockMsg = "Failure";
      const expectedActions = [
        {
          type: activeLabelActions.REQUEST_ADD_ACTIVE_LABEL
        },
        {
          type: activeLabelActions.RECEIVE_ADD_ACTIVE_LABEL,
          label: label,
          receipts: [],
          numPages: 0,
          numReceipts: 0,
          success: false
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: errorSnackbar
        }
      ];

      fetchMock.getOnce(
        constants.HOST_URL +
          constants.GET_RECEIPTS_PATH +
          "?activeLabelNames=NewActiveLabel",
        {
          body: {
            success: false,
            message: mockMsg
          },
          status: 404,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({
        activeLabels: {
          items: activeLabels
        },
        receipts: {
          query: "",
          currentPage: 0,
          numPages: 0,
          totalNumReceipts: 0,
          items: [],
          isLoading: false
        }
      });

      return store.dispatch(actions.addActiveLabel(label)).then(function() {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("removeActiveLabel", function() {
    afterEach(function() {
      fetchMock.restore();
    });

    it("creates REQUEST and RECEIVE actions for REMOVE_ACTIVE_LABEL", function() {
      const label = { name: "NewActiveLabel" };
      const activeLabels = [label];
      const mockMsg = "Success";

      const expectedActions = [
        {
          type: activeLabelActions.REQUEST_REMOVE_ACTIVE_LABEL
        },
        {
          type: activeLabelActions.RECEIVE_REMOVE_ACTIVE_LABEL,
          label: label,
          receipts: [],
          numPages: 0,
          numReceipts: 0,
          success: true
        }
      ];

      fetchMock.getOnce(constants.HOST_URL + constants.GET_RECEIPTS_PATH, {
        body: {
          success: true,
          message: mockMsg,
          receipts: [],
          totalNumReceipts: 0,
          numPages: 0
        },
        status: 200,
        headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
      });
      const store = mockStore({
        activeLabels: {
          items: activeLabels
        },
        receipts: {
          query: "",
          currentPage: 0,
          numPages: 0,
          totalNumReceipts: 0,
          items: [],
          isLoading: false
        }
      });

      return store.dispatch(actions.removeActiveLabel(label)).then(function() {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("creates REQUEST, RECEIVE and ADD_SNACKBAR actions for unsuccessful REMOVE_ACTIVE_LABEL", function() {
      const label = { name: "NewActiveLabel" };
      const activeLabels = [label];
      const mockMsg = "Failure";
      const expectedActions = [
        {
          type: activeLabelActions.REQUEST_REMOVE_ACTIVE_LABEL
        },
        {
          type: activeLabelActions.RECEIVE_REMOVE_ACTIVE_LABEL,
          label: label,
          receipts: [],
          numPages: 0,
          numReceipts: 0,
          success: false
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: errorSnackbar
        }
      ];

      fetchMock.getOnce(constants.HOST_URL + constants.GET_RECEIPTS_PATH, {
        body: {
          success: false,
          message: mockMsg
        },
        status: 404,
        headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
      });
      const store = mockStore({
        activeLabels: {
          items: activeLabels
        },
        receipts: {
          query: "",
          currentPage: 0,
          numPages: 0,
          totalNumReceipts: 0,
          items: [],
          isLoading: false
        }
      });

      return store.dispatch(actions.removeActiveLabel(label)).then(function() {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("editActiveLabel", function() {
    afterEach(function() {
      fetchMock.restore();
    });

    it("creates REQUEST and RECEIVE actions for EDIT_ACTIVE_LABEL", function() {
      const newLabel = { name: "NewActiveLabel" };
      const oldLabel = { name: "OldActiveLabel" };
      const activeLabels = [oldLabel];
      const mockMsg = "Success";

      const expectedActions = [
        {
          type: activeLabelActions.REQUEST_EDIT_ACTIVE_LABEL
        },
        {
          type: activeLabelActions.RECEIVE_EDIT_ACTIVE_LABEL,
          newLabel: newLabel,
          oldLabel: oldLabel,
          success: true
        }
      ];

      fetchMock.getOnce(
        constants.HOST_URL +
          constants.GET_RECEIPTS_PATH +
          "?activeLabelNames=NewActiveLabel",
        {
          body: {
            success: true,
            message: mockMsg
          },
          status: 200,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({
        activeLabels: {
          items: activeLabels
        },
        receipts: {
          query: "",
          currentPage: 0,
          numPages: 0,
          totalNumReceipts: 0,
          items: [],
          isLoading: false
        }
      });

      return store
        .dispatch(actions.editActiveLabel(oldLabel, newLabel))
        .then(function() {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("creates REQUEST, RECEIVE, and SNACKBAR actions for unsuccessful EDIT_ACTIVE_LABEL", function() {
      const newLabel = { name: "NewActiveLabel" };
      const oldLabel = { name: "OldActiveLabel" };
      const activeLabels = [oldLabel];
      const mockMsg = "Failure";

      const expectedActions = [
        {
          type: activeLabelActions.REQUEST_EDIT_ACTIVE_LABEL
        },
        {
          type: activeLabelActions.RECEIVE_EDIT_ACTIVE_LABEL,
          newLabel: newLabel,
          oldLabel: oldLabel,
          success: false
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: errorSnackbar
        }
      ];

      fetchMock.getOnce(
        constants.HOST_URL +
          constants.GET_RECEIPTS_PATH +
          "?activeLabelNames=NewActiveLabel",
        {
          body: {
            success: false,
            message: mockMsg
          },
          status: 404,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({
        activeLabels: {
          items: activeLabels
        },
        receipts: {
          query: "",
          currentPage: 0,
          numPages: 0,
          totalNumReceipts: 0,
          items: [],
          isLoading: false
        }
      });

      return store
        .dispatch(actions.editActiveLabel(oldLabel, newLabel))
        .then(function() {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe("queryReceipts", function() {
    afterEach(function() {
      fetchMock.restore();
    });

    it("creates REQUEST and RECEIVE actions for QUERY_RECEIPTS", function() {
      const query = "MyTestQuery";
      const mockMsg = "Success";
      const receipts = [
        {
          title: "MyReceipt"
        }
      ];
      const expectedActions = [
        {
          type: actions.REQUEST_QUERY_RECEIPTS
        },
        {
          type: actions.RECEIVE_QUERY_RECEIPTS,
          receipts: receipts,
          query: query,
          numPages: 3,
          numReceipts: 3,
          success: true
        }
      ];

      fetchMock.getOnce(
        constants.HOST_URL + constants.GET_RECEIPTS_PATH + "?query=" + query,
        {
          body: {
            success: true,
            receipts: receipts,
            totalNumReceipts: 3,
            numPages: 3,
            message: mockMsg
          },
          status: 200,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({
        activeLabels: {
          items: []
        },
        receipts: {
          query: "",
          currentPage: 0,
          numPages: 0,
          totalNumReceipts: 0,
          items: [],
          isLoading: false
        }
      });

      return store.dispatch(actions.queryReceipts(query)).then(function() {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("creates REQUEST, RECEIVE, and ADD_SNACKBAR actions for unsuccessful QUERY_RECEIPTS", function() {
      const query = "MyTestQuery";
      const mockMsg = "Failure";
      const expectedActions = [
        {
          type: actions.REQUEST_QUERY_RECEIPTS
        },
        {
          type: actions.RECEIVE_QUERY_RECEIPTS,
          receipts: [],
          query: query,
          numPages: 0,
          numReceipts: 0,
          success: false
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: errorSnackbar
        }
      ];

      fetchMock.getOnce(
        constants.HOST_URL + constants.GET_RECEIPTS_PATH + "?query=" + query,
        {
          body: {
            success: false,
            message: mockMsg
          },
          status: 404,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({
        activeLabels: {
          items: []
        },
        receipts: {
          query: "",
          currentPage: 0,
          numPages: 0,
          totalNumReceipts: 0,
          items: [],
          isLoading: false
        }
      });

      return store.dispatch(actions.queryReceipts(query)).then(function() {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("changeReceiptPage", function() {
    afterEach(function() {
      fetchMock.restore();
    });

    it("creates REQUEST and RECEIVE actions for RECEIPT_PAGE_LOAD", function() {
      const currentPageNum = 1;
      const newPageNum = 2;
      const mockMsg = "Success";
      const receipts = [
        {
          title: "MyReceipt"
        }
      ];
      const expectedActions = [
        {
          type: actions.REQUEST_RECEIPT_PAGE_LOAD
        },
        {
          type: actions.RECEIVE_RECEIPT_PAGE_LOAD,
          receipts: receipts,
          pageNum: 2,
          success: true
        }
      ];

      fetchMock.getOnce(
        constants.HOST_URL +
          constants.GET_RECEIPTS_PATH +
          "?pageNum=" +
          newPageNum,
        {
          body: {
            success: true,
            receipts: receipts,
            message: mockMsg
          },
          status: 200,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({
        activeLabels: {
          items: []
        },
        receipts: {
          query: "",
          currentPage: currentPageNum,
          numPages: 0,
          totalNumReceipts: 0,
          items: [],
          isLoading: false
        }
      });

      return store
        .dispatch(actions.loadReceiptPage(newPageNum))
        .then(function() {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("creates REQUEST, RECEIVE, and ADD_SNACKBAR actions for unsuccessful RECEIPT_PAGE_LOAD", function() {
      const currentPageNum = 1;
      const mockMsg = "Failure";
      const expectedActions = [
        {
          type: actions.REQUEST_RECEIPT_PAGE_LOAD
        },
        {
          type: actions.RECEIVE_RECEIPT_PAGE_LOAD,
          receipts: [],
          pageNum: currentPageNum,
          success: false
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: errorSnackbar
        }
      ];

      fetchMock.getOnce(
        constants.HOST_URL +
          constants.GET_RECEIPTS_PATH +
          "?pageNum=" +
          currentPageNum,
        {
          body: {
            success: false,
            message: mockMsg
          },
          status: 404,
          headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
        }
      );
      const store = mockStore({
        activeLabels: {
          items: []
        },
        receipts: {
          query: "",
          currentPage: currentPageNum,
          numPages: 0,
          totalNumReceipts: 0,
          items: [],
          isLoading: false
        }
      });

      return store
        .dispatch(actions.loadReceiptPage(currentPageNum))
        .then(function() {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });
});
