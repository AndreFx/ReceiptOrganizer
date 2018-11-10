import reducer from "../../../app/reducers/activeLabelsReducer";
import * as actions from "../../../app/actions/receipts/activeLabelsActions";
import * as constants from "../../../common/constants";

describe("activeLabelReducer", function() {
  it("should return the initial state", function() {
    expect(reducer(undefined, {})).toEqual({
      items: []
    });
  });

  it("should handle a successful RECEIVE_ADD_ACTIVE_LABEL", function() {
    const label = {
      name: "Advance"
    };

    expect(
      reducer(
        {
          items: []
        },
        {
          type: actions.RECEIVE_ADD_ACTIVE_LABEL,
          label: label,
          success: true,
          msg: "Success"
        }
      )
    ).toEqual({
      items: [label]
    });
  });

  it("should handle an unsuccessful RECEIVE_ADD_ACTIVE_LABEL", function() {
    const label = {
      name: "Advance"
    };

    expect(
      reducer(
        {
          items: []
        },
        {
          type: actions.RECEIVE_ADD_ACTIVE_LABEL,
          label: label,
          success: false,
          msg: "Fail"
        }
      )
    ).toEqual({
      items: []
    });
  });

  it("should handle a successful RECEIVE_REMOVE_ACTIVE_LABEL", function() {
    const label = {
      name: "Advance"
    };

    expect(
      reducer(
        {
          items: [
            { name: "Unrelated" },
            label,
            { name: "Labels" },
            { name: "Don't get deleted" }
          ]
        },
        {
          type: actions.RECEIVE_REMOVE_ACTIVE_LABEL,
          label: label,
          success: true,
          msg: "Pass"
        }
      )
    ).toEqual({
      items: [
        { name: "Unrelated" },
        { name: "Labels" },
        { name: "Don't get deleted" }
      ]
    });
  });

  it("should handle an unsuccessful RECEIVE_REMOVE_ACTIVE_LABEL", function() {
    const items = [
      { name: "Unrelated" },
      { name: "Advanced" },
      { name: "Labels" },
      { name: "Don't get deleted" }
    ];

    expect(
      reducer(
        {
          items: items
        },
        {
          type: actions.RECEIVE_REMOVE_ACTIVE_LABEL,
          label: { name: "Failure Label" },
          success: false,
          msg: "Fail"
        }
      )
    ).toEqual({
      items: items
    });
  });

  it("should handle a successful RECEIVE_EDIT_ACTIVE_LABEL", function() {
    const items = [
      { name: "Unrelated" },
      { name: "Advanced" },
      { name: "Labels" },
      { name: "Don't get deleted" }
    ];
    const expectedItems = [
      { name: "Unrelated" },
      { name: "Advanced" },
      { name: "Success Label" },
      { name: "Don't get deleted" }
    ];

    expect(
      reducer(
        {
          items: items
        },
        {
          type: actions.RECEIVE_EDIT_ACTIVE_LABEL,
          newLabel: { name: "Success Label" },
          oldLabel: { name: "Labels" },
          success: true,
          msg: "Success"
        }
      )
    ).toEqual({
      items: expectedItems
    });
  });

  it("should handle an unsuccessful RECEIVE_EDIT_ACTIVE_LABEL", function() {
    const items = [
      { name: "Unrelated" },
      { name: "Advanced" },
      { name: "Labels" },
      { name: "Don't get deleted" }
    ];

    expect(
      reducer(
        {
          items: items
        },
        {
          type: actions.RECEIVE_EDIT_ACTIVE_LABEL,
          newLabel: { name: "Success Label" },
          oldLabel: { name: "Labels" },
          success: false,
          msg: "Failure"
        }
      )
    ).toEqual({
      items: items
    });
  });
});
