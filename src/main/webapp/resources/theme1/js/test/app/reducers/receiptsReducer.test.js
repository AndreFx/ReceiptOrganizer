import reducer, {
  RECEIPTS_INITIAL_STATE
} from "../../../app/reducers/receiptsReducer";
import * as actions from "../../../app/actions/receipts/activeLabelsActions";

describe("receiptsReducer", function() {
  const loadingState = {
    isLoading: true
  };

  it("should return the initial state", function() {
    expect(reducer(undefined, {})).toEqual(RECEIPTS_INITIAL_STATE);
  });

  it("should handle REQUEST_ADD_ACTIVE_LABEL", function() {
    const action = {
      type: actions.REQUEST_ADD_ACTIVE_LABEL
    };
    const expectedState = {
      isLoading: true
    };

    expect(reducer(RECEIPTS_INITIAL_STATE, action)).toEqual(expectedState);
  });

  it("should handle REQUEST_EDIT_ACTIVE_LABEL", function() {
    const action = {
      type: actions.REQUEST_EDIT_ACTIVE_LABEL
    };
    const expectedState = {
      isLoading: true
    };

    expect(reducer(RECEIPTS_INITIAL_STATE, action)).toEqual(expectedState);
  });

  it("should handle REQUEST_REMOVE_ACTIVE_LABEL", function() {
    const action = {
      type: actions.REQUEST_REMOVE_ACTIVE_LABEL
    };
    const expectedState = {
      isLoading: true
    };

    expect(reducer(RECEIPTS_INITIAL_STATE, action)).toEqual(expectedState);
  });

  it("should handle RECEIVE_ADD_ACTIVE_LABEL", function() {
    const action = {
      type: actions.RECEIVE_ADD_ACTIVE_LABEL
    };
    const expectedState = {
      isLoading: false
    };

    expect(reducer(loadingState, action)).toEqual(expectedState);
  });

  it("should handle RECEIVE_EDIT_ACTIVE_LABEL", function() {
    const action = {
      type: actions.RECEIVE_EDIT_ACTIVE_LABEL
    };
    const expectedState = {
      isLoading: false
    };

    expect(reducer(loadingState, action)).toEqual(expectedState);
  });

  it("should handle RECEIVE_REMOVE_ACTIVE_LABEL", function() {
    const action = {
      type: actions.RECEIVE_REMOVE_ACTIVE_LABEL
    };
    const expectedState = {
      isLoading: false
    };

    expect(reducer(loadingState, action)).toEqual(expectedState);
  });
});
