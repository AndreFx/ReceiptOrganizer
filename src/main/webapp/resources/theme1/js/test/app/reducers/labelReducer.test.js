import reducer, {
  LABEL_INITIAL_STATE
} from "../../../app/reducers/labelReducer";
import * as actions from "../../../app/actions/labels/labelListActions";

describe("labelReducer", function() {
  it("should return the initial state", function() {
    expect(reducer(undefined, {})).toEqual(LABEL_INITIAL_STATE);
  });

  /**
   * Fetch labels
   */
  const mockedLabelItems = [{ name: "MyLabelName" }];

  const mockedLabel = {
    name: "TestLabel"
  };

  const loadingState = {
    isInitializing: false,
    items: [],
    isLoading: true
  };

  it("should handle REQUEST_LABELS", function() {
    const action = {
      type: actions.REQUEST_LABELS
    };
    const expectedState = {
      isLoading: false,
      items: [],
      isInitializing: true
    };

    expect(reducer(LABEL_INITIAL_STATE, action)).toEqual(expectedState);
  });

  it("should handle a successful RECEIVE_LABELS", function() {
    const initialState = {
      items: [],
      isInitializing: true
    };
    const expectedState = {
      isInitializing: false,
      items: mockedLabelItems
    };
    const action = {
      type: actions.RECEIVE_LABELS,
      labels: mockedLabelItems,
      success: true,
      msg: "Success!"
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle an unsuccessful RECEIVE_LABELS", function() {
    const initialState = {
      isInitializing: true
    };
    const action = {
      type: actions.RECEIVE_LABELS,
      labels: mockedLabelItems,
      success: false,
      msg: "Failure ):"
    };
    const expectedState = {
      isInitializing: false
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  /**
   * Add Label
   */

  it("should handle REQUEST_ADD_LABELS", function() {
    const action = {
      type: actions.REQUEST_ADD_LABEL
    };

    expect(reducer(LABEL_INITIAL_STATE, action)).toEqual(loadingState);
  });

  it("should handle a successful RECEIVE_ADD_LABEL with empty labels.item state", function() {
    const initialState = {
      isLoading: true,
      items: []
    };
    const action = {
      type: actions.RECEIVE_ADD_LABEL,
      label: mockedLabel,
      success: true,
      msg: "Some message"
    };
    const expectedState = {
      isLoading: false,
      items: [mockedLabel]
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle a successful RECEIVE_ADD_LABEL with non-empty label.items state and sort required", function() {
    const lastLabel = {
      name: "ZLastLabel"
    };
    const initialState = {
      isLoading: true,
      items: [lastLabel]
    };
    const action = {
      type: actions.RECEIVE_ADD_LABEL,
      label: mockedLabel,
      success: true,
      msg: "Some message"
    };
    const expectedState = {
      isLoading: false,
      items: [mockedLabel, lastLabel]
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle an unsuccessful RECEIVE_ADD_LABEL", function() {
    const initialState = {
      isLoading: true,
      items: mockedLabelItems
    };
    const action = {
      type: actions.RECEIVE_ADD_LABEL,
      label: mockedLabel,
      success: false,
      msg: "Some failure msg :("
    };
    const expectedState = {
      isLoading: false,
      items: mockedLabelItems
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  /**
   * Edit Label
   */

  it("should handle REQUEST_EDIT_LABEL", function() {
    const action = {
      type: actions.REQUEST_EDIT_LABEL
    };

    expect(reducer(LABEL_INITIAL_STATE, action)).toEqual(loadingState);
  });

  it("should handle a successful RECEIVE_EDIT_LABEL", function() {
    const initialState = {
      isLoading: true,
      items: mockedLabelItems
    };
    const action = {
      type: actions.RECEIVE_EDIT_LABEL,
      newLabel: mockedLabel,
      oldLabel: mockedLabelItems[0],
      success: true,
      msg: "Success!"
    };
    const expectedState = {
      isLoading: false,
      items: [mockedLabel]
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle an unsuccessful RECEIVE_EDIT_LABEL", function() {
    const initialState = {
      isLoading: true,
      items: []
    };
    const action = {
      type: actions.RECEIVE_EDIT_LABEL,
      label: mockedLabel,
      success: false,
      msg: "Some failure msg :("
    };
    const expectedState = {
      isLoading: false,
      items: []
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  /**
   * Delete label
   */

  it("should handle REQUEST_DELETE_LABEL", function() {
    const action = {
      type: actions.REQUEST_DELETE_LABEL
    };

    expect(reducer(LABEL_INITIAL_STATE, action)).toEqual(loadingState);
  });

  it("should handle a successful RECEIVE_DELETE_LABEL", function() {
    const initialState = {
      isLoading: true,
      items: mockedLabelItems
    };
    const action = {
      type: actions.RECEIVE_DELETE_LABEL,
      label: mockedLabelItems[0],
      success: true,
      msg: "Deleted!"
    };
    const expectedState = {
      isLoading: false,
      items: []
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle a successful RECEIVE_DELETE_LABEL with multiple labels in state", function() {
    const labelItems = [
      { name: "Something" },
      { name: "Other" },
      { name: "Cars" }
    ];
    const initialState = {
      isLoading: true,
      items: labelItems
    };
    const action = {
      type: actions.RECEIVE_DELETE_LABEL,
      label: labelItems[1],
      success: true,
      msg: "Deleted!"
    };
    const expectedState = {
      isLoading: false,
      items: [{ name: "Something" }, { name: "Cars" }]
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle a unsuccessful RECEIVE_DELETE_LABEL", function() {
    const initialState = {
      isLoading: true,
      items: []
    };
    const action = {
      type: actions.RECEIVE_DELETE_LABEL,
      label: mockedLabel,
      success: false,
      msg: "Some failure msg :("
    };
    const expectedState = {
      isLoading: false,
      items: []
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});
