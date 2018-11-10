import reducer from "../../../app/reducers/labelReducer";
import * as actions from "../../../app/actions/labels/labelListActions";
import * as constants from "../../../common/constants";

describe("labelReducer", function() {
  it("should return the initial state", function() {
    expect(reducer(undefined, {})).toEqual({
      isInitializing: false,
      isLoading: false,
      items: []
    });
  });

  /**
   * Fetch labels
   */
  const mockedLabelItems = [{ name: "MyLabelName" }];

  const mockedLabel = {
    name: "TestLabel"
  };

  it("should handle REQUEST_LABELS", function() {
    expect(
      reducer(
        {},
        {
          type: actions.REQUEST_LABELS
        }
      )
    ).toEqual({
      isInitializing: true
    });
  });

  it("should handle a successful RECEIVE_LABELS", function() {
    expect(
      reducer(
        {
          items: [],
          isInitializing: true
        },
        {
          type: actions.RECEIVE_LABELS,
          labels: mockedLabelItems,
          success: true,
          msg: "Success!"
        }
      )
    ).toEqual({
      isInitializing: false,
      items: mockedLabelItems
    });
  });

  it("should handle an unsuccessful RECEIVE_LABELS", function() {
    expect(
      reducer(
        {
          isInitializing: true
        },
        {
          type: actions.RECEIVE_LABELS,
          labels: mockedLabelItems,
          success: false,
          msg: "Failure ):"
        }
      )
    ).toEqual({
      isInitializing: false
    });
  });

  /**
   * Add Label
   */

  it("should handle REQUEST_ADD_LABELS", function() {
    expect(
      reducer(
        {},
        {
          type: actions.REQUEST_ADD_LABEL
        }
      )
    ).toEqual({
      isLoading: true
    });
  });

  it("should handle a successful RECEIVE_ADD_LABEL with empty labels.item state", function() {
    expect(
      reducer(
        {
          isLoading: true,
          items: []
        },
        {
          type: actions.RECEIVE_ADD_LABEL,
          label: mockedLabel,
          success: true,
          msg: "Some message"
        }
      )
    ).toEqual({
      isLoading: false,
      items: [mockedLabel]
    });
  });

  it("should handle a successful RECEIVE_ADD_LABEL with non-empty label.items state and sort required", function() {
    const lastLabel = {
      name: "ZLastLabel"
    };

    expect(
      reducer(
        {
          isLoading: true,
          items: [lastLabel]
        },
        {
          type: actions.RECEIVE_ADD_LABEL,
          label: mockedLabel,
          success: true,
          msg: "Some message"
        }
      )
    ).toEqual({
      isLoading: false,
      items: [mockedLabel, lastLabel]
    });
  });

  it("should handle an unsuccessful RECEIVE_ADD_LABEL", function() {
    expect(
      reducer(
        {
          isLoading: true,
          items: mockedLabelItems
        },
        {
          type: actions.RECEIVE_ADD_LABEL,
          label: mockedLabel,
          success: false,
          msg: "Some failure msg :("
        }
      )
    ).toEqual({
      isLoading: false,
      items: mockedLabelItems
    });
  });

  /**
   * Edit Label
   */

  it("should handle REQUEST_EDIT_LABEL", function() {
    expect(
      reducer(
        {},
        {
          type: actions.REQUEST_EDIT_LABEL
        }
      )
    ).toEqual({
      isLoading: true
    });
  });

  it("should handle a successful RECEIVE_EDIT_LABEL", function() {
    expect(
      reducer(
        {
          isLoading: true,
          items: mockedLabelItems
        },
        {
          type: actions.RECEIVE_EDIT_LABEL,
          newLabel: mockedLabel,
          oldLabel: mockedLabelItems[0],
          success: true,
          msg: "Success!"
        }
      )
    ).toEqual({
      isLoading: false,
      items: [mockedLabel]
    });
  });

  it("should handle an unsuccessful RECEIVE_EDIT_LABEL", function() {
    expect(
      reducer(
        {
          isLoading: true,
          items: []
        },
        {
          type: actions.RECEIVE_EDIT_LABEL,
          label: mockedLabel,
          success: false,
          msg: "Some failure msg :("
        }
      )
    ).toEqual({
      isLoading: false,
      items: []
    });
  });

  /**
   * Delete label
   */

  it("should handle REQUEST_DELETE_LABEL", function() {
    expect(
      reducer(
        {},
        {
          type: actions.REQUEST_DELETE_LABEL
        }
      )
    ).toEqual({
      isLoading: true
    });
  });

  it("should handle a successful RECEIVE_DELETE_LABEL", function() {
    expect(
      reducer(
        {
          isLoading: true,
          items: mockedLabelItems
        },
        {
          type: actions.RECEIVE_DELETE_LABEL,
          label: mockedLabelItems[0],
          success: true,
          msg: "Deleted!"
        }
      )
    ).toEqual({
      isLoading: false,
      items: []
    });
  });

  it("should handle a successful RECEIVE_DELETE_LABEL with multiple labels in state", function() {
    const labelItems = [
      { name: "Something" },
      { name: "Other" },
      { name: "Cars" }
    ];

    expect(
      reducer(
        {
          isLoading: true,
          items: labelItems
        },
        {
          type: actions.RECEIVE_DELETE_LABEL,
          label: labelItems[1],
          success: true,
          msg: "Deleted!"
        }
      )
    ).toEqual({
      isLoading: false,
      items: [{ name: "Something" }, { name: "Cars" }]
    });
  });

  it("should handle a unsuccessful RECEIVE_DELETE_LABEL", function() {
    expect(
      reducer(
        {
          isLoading: true,
          items: []
        },
        {
          type: actions.RECEIVE_DELETE_LABEL,
          label: mockedLabel,
          success: false,
          msg: "Some failure msg :("
        }
      )
    ).toEqual({
      isLoading: false,
      items: []
    });
  });
});
