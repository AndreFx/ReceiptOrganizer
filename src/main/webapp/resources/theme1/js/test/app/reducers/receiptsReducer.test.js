import _ from "lodash";
import reducer, {
  RECEIPTS_INITIAL_STATE
} from "../../../app/reducers/receiptsReducer";
import * as actions from "../../../app/actions/receipts/activeLabelsActions";
import * as receiptActions from "../../../app/actions/receipts/receiptsActions";

describe("receiptsReducer", function() {
  let loadingState = _.cloneDeep(RECEIPTS_INITIAL_STATE);
  loadingState.isLoading = true;

  it("should return the initial state", function() {
    expect(reducer(undefined, {})).toEqual(RECEIPTS_INITIAL_STATE);
  });

  it("should handle REQUEST_ADD_ACTIVE_LABEL", function() {
    const action = {
      type: actions.REQUEST_ADD_ACTIVE_LABEL
    };

    expect(reducer(RECEIPTS_INITIAL_STATE, action)).toEqual(loadingState);
  });

  it("should handle REQUEST_EDIT_ACTIVE_LABEL", function() {
    const action = {
      type: actions.REQUEST_EDIT_ACTIVE_LABEL
    };

    expect(reducer(RECEIPTS_INITIAL_STATE, action)).toEqual(loadingState);
  });

  it("should handle REQUEST_REMOVE_ACTIVE_LABEL", function() {
    const action = {
      type: actions.REQUEST_REMOVE_ACTIVE_LABEL
    };

    expect(reducer(RECEIPTS_INITIAL_STATE, action)).toEqual(loadingState);
  });

  it("should handle REQUEST_QUERY_RECEIPTS", function() {
    const action = {
      type: receiptActions.REQUEST_QUERY_RECEIPTS
    };

    expect(reducer(RECEIPTS_INITIAL_STATE, action)).toEqual(loadingState);
  });

  it("should handle REQUEST_RECEIPT_PAGE_CHANGE", function() {
    const action = {
      type: receiptActions.REQUEST_RECEIPT_PAGE_CHANGE
    };

    expect(reducer(RECEIPTS_INITIAL_STATE, action)).toEqual(loadingState);
  });

  it("should handle successful RECEIVE_ADD_ACTIVE_LABEL", function() {
    const receipts = [{ title: "Some Receipt" }];
    const action = {
      type: actions.RECEIVE_ADD_ACTIVE_LABEL,
      label: { name: "NewLabel" },
      receipts: receipts,
      numPages: 1,
      numReceipts: 1,
      success: true
    };
    const expectedState = {
      isLoading: false,
      items: receipts,
      currentPage: 0,
      numPages: 1,
      totalNumReceipts: 1,
      query: ""
    };

    expect(reducer(loadingState, action)).toEqual(expectedState);
  });

  it("should handle unsuccessful RECEIVE_ADD_ACTIVE_LABEL", function() {
    const action = {
      type: actions.RECEIVE_ADD_ACTIVE_LABEL,
      label: { name: "NewLabel" },
      receipts: [],
      numPages: 0,
      numReceipts: 0,
      success: false
    };

    expect(reducer(loadingState, action)).toEqual(RECEIPTS_INITIAL_STATE);
  });

  it("should handle successful RECEIVE_EDIT_ACTIVE_LABEL", function() {
    const action = {
      type: actions.RECEIVE_EDIT_ACTIVE_LABEL,
      newLabel: { name: "NewLabel" },
      oldLabel: { name: "OldLabel" },
      success: true
    };

    expect(reducer(loadingState, action)).toEqual(RECEIPTS_INITIAL_STATE);
  });

  it("should handle unsuccessful RECEIVE_EDIT_ACTIVE_LABEL", function() {
    const action = {
      type: actions.RECEIVE_EDIT_ACTIVE_LABEL,
      newLabel: { name: "NewLabel" },
      oldLabel: { name: "OldLabel" },
      success: false
    };

    expect(reducer(loadingState, action)).toEqual(RECEIPTS_INITIAL_STATE);
  });

  it("should handle successful RECEIVE_REMOVE_ACTIVE_LABEL", function() {
    const receipts = [{ title: "DisplayReceipt" }];
    const action = {
      type: actions.RECEIVE_REMOVE_ACTIVE_LABEL,
      label: { name: "SomeLabel" },
      receipts: receipts,
      numReceipts: 1,
      numPages: 1,
      success: true
    };
    const expectedState = Object.assign({}, loadingState, {
      items: receipts,
      isLoading: false,
      numPages: 1,
      totalNumReceipts: 1
    });

    expect(reducer(loadingState, action)).toEqual(expectedState);
  });

  it("should handle unsuccessful RECEIVE_REMOVE_ACTIVE_LABEL", function() {
    const action = {
      type: actions.RECEIVE_REMOVE_ACTIVE_LABEL,
      label: { name: "SomeLabel" },
      receipts: [],
      numReceipts: 1,
      numPages: 1,
      success: false
    };
    const expectedState = Object.assign({}, loadingState, {
      isLoading: false
    });

    expect(reducer(loadingState, action)).toEqual(expectedState);
  });

  it("should handle successful RECEIVE_QUERY_RECEIPTS", function() {
    const receipts = [
      {
        title: "MyReceipt"
      },
      {
        title: "MyOtherReceipt"
      }
    ];
    const action = {
      type: receiptActions.RECEIVE_QUERY_RECEIPTS,
      receipts: receipts,
      query: "Find my receipt!",
      numReceipts: 2,
      numPages: 1,
      success: true
    };
    const expectedState = {
      isLoading: false,
      items: receipts,
      totalNumReceipts: 2,
      numPages: 1,
      currentPage: 0,
      query: "Find my receipt!"
    };

    expect(reducer(loadingState, action)).toEqual(expectedState);
  });

  it("should handle unsuccessful RECEIVE_QUERY_RECEIPTS", function() {
    const receipts = [
      {
        title: "MyReceipt"
      },
      {
        title: "MyOtherReceipt"
      }
    ];
    const action = {
      type: receiptActions.RECEIVE_QUERY_RECEIPTS,
      receipts: receipts,
      query: "Find my receipt!",
      numReceipts: 2,
      numPages: 1,
      success: false
    };
    const expectedState = Object.assign({}, loadingState, {
      isLoading: false
    });

    expect(reducer(loadingState, action)).toEqual(expectedState);
  });

  it("should handle successful RECEIVE_RECEIPT_CHANGE_PAGE", function() {
    const receiptsPage1 = [
      {
        title: "MyReceipt"
      },
      {
        title: "MyOtherReceipt"
      }
    ];
    const receiptsPage2 = [
      {
        title: "SomeReceipt"
      },
      {
        title: "Something"
      }
    ];
    const action = {
      type: receiptActions.RECEIVE_RECEIPT_PAGE_CHANGE,
      receipts: receiptsPage2,
      pageNum: 1,
      success: true
    };
    const initialState = Object.assign({}, loadingState, {
      items: receiptsPage1,
      currentPage: 0,
      numPages: 2,
      totalNumReceipts: 4,
      query: "Find my receipt!",
      isLoading: true
    });
    const expectedState = {
      isLoading: false,
      items: receiptsPage2,
      totalNumReceipts: 4,
      numPages: 2,
      currentPage: 1,
      query: "Find my receipt!"
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle unsuccessful RECEIVE_QUERY_RECEIPTS", function() {
    const receiptsPage1 = [
      {
        title: "MyReceipt"
      },
      {
        title: "MyOtherReceipt"
      }
    ];
    const receiptsPage2 = [
      {
        title: "SomeReceipt"
      },
      {
        title: "Something"
      }
    ];
    const action = {
      type: receiptActions.RECEIVE_RECEIPT_PAGE_CHANGE,
      receipts: receiptsPage2,
      pageNum: 1,
      success: false
    };
    const initialState = Object.assign({}, loadingState, {
      items: receiptsPage1,
      currentPage: 0,
      numPages: 2,
      totalNumReceipts: 4,
      query: "Find my receipt!",
      isLoading: true
    });
    const expectedState = Object.assign({}, initialState, {
      isLoading: false
    });

    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});
