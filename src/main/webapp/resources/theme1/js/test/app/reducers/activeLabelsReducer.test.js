import reducer, {
  ACTIVE_LABELS_INITIAL_STATE
} from "../../../app/reducers/activeLabelsReducer";
import * as actions from "../../../app/actions/receipts/activeLabelsActions";

describe("activeLabelReducer", function() {
  const items = [
    { name: "Unrelated" },
    { name: "Advanced" },
    { name: "Labels" },
    { name: "Don't get deleted" }
  ];
  const itemsInitialState = {
    items: items
  };

  it("should return the initial state", function() {
    expect(reducer(undefined, {})).toEqual(ACTIVE_LABELS_INITIAL_STATE);
  });

  it("should handle a successful RECEIVE_ADD_ACTIVE_LABEL", function() {
    const label = {
      name: "Advance"
    };
    const action = {
      type: actions.RECEIVE_ADD_ACTIVE_LABEL,
      label: label,
      success: true,
      msg: "Success"
    };
    const expectedState = {
      items: [label]
    };

    expect(reducer(ACTIVE_LABELS_INITIAL_STATE, action)).toEqual(expectedState);
  });

  it("should handle an unsuccessful RECEIVE_ADD_ACTIVE_LABEL", function() {
    const label = {
      name: "Advance"
    };
    const action = {
      type: actions.RECEIVE_ADD_ACTIVE_LABEL,
      label: label,
      success: false,
      msg: "Fail"
    };

    expect(reducer(ACTIVE_LABELS_INITIAL_STATE, action)).toEqual(
      ACTIVE_LABELS_INITIAL_STATE
    );
  });

  it("should handle a successful RECEIVE_REMOVE_ACTIVE_LABEL", function() {
    const label = {
      name: "Advance"
    };
    const initialState = {
      items: [
        { name: "Unrelated" },
        label,
        { name: "Labels" },
        { name: "Don't get deleted" }
      ]
    };
    const action = {
      type: actions.RECEIVE_REMOVE_ACTIVE_LABEL,
      label: label,
      success: true,
      msg: "Pass"
    };
    const expectedState = {
      items: [
        { name: "Unrelated" },
        { name: "Labels" },
        { name: "Don't get deleted" }
      ]
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle an unsuccessful RECEIVE_REMOVE_ACTIVE_LABEL", function() {
    const action = {
      type: actions.RECEIVE_REMOVE_ACTIVE_LABEL,
      label: { name: "Failure Label" },
      success: false,
      msg: "Fail"
    };
    const expectedState = {
      items: items
    };

    expect(reducer(itemsInitialState, action)).toEqual(expectedState);
  });

  it("should handle a successful RECEIVE_EDIT_ACTIVE_LABEL", function() {
    const action = {
      type: actions.RECEIVE_EDIT_ACTIVE_LABEL,
      newLabel: { name: "Success Label" },
      oldLabel: { name: "Labels" },
      success: true,
      msg: "Success"
    };
    const expectedState = {
      items: [
        { name: "Unrelated" },
        { name: "Advanced" },
        { name: "Success Label" },
        { name: "Don't get deleted" }
      ]
    };

    expect(reducer(itemsInitialState, action)).toEqual(expectedState);
  });

  it("should handle an unsuccessful RECEIVE_EDIT_ACTIVE_LABEL", function() {
    const action = {
      type: actions.RECEIVE_EDIT_ACTIVE_LABEL,
      newLabel: { name: "Success Label" },
      oldLabel: { name: "Labels" },
      success: false,
      msg: "Failure"
    };
    const expectedState = {
      items: items
    };

    expect(reducer(itemsInitialState, action)).toEqual(expectedState);
  });
});
