import reducer, {
  DIALOG_INITIAL_STATE
} from "../../../app/reducers/dialogReducer";
import * as actions from "../../../app/actions/ui/dialog/dialogActions";

describe("dialogReducer", function() {
  const dummyFunc = function() {
    return null;
  };

  const mockOptions = {
    dialogText: "Enter some input",
    textFields: [
      {
        label: "Email",
        defaultValue: "test@email.co"
      }
    ],
    submitText: "Submit",
    cancelText: "Cancel"
  };

  it("should return the initial state", function() {
    expect(reducer(DIALOG_INITIAL_STATE, {})).toEqual(DIALOG_INITIAL_STATE);
  });

  it("should handle the CLOSE_DIALOG action with empty input options", function() {
    const initialState = {
      open: true,
      title: null,
      close: null,
      submit: null,
      options: null
    };
    const expectedState = {
      open: false,
      title: null,
      close: null,
      submit: null,
      options: null
    };

    expect(
      reducer(initialState, {
        type: actions.CLOSE_DIALOG
      })
    ).toEqual(expectedState);
  });

  it("should handle the CLOSE_DIALOG action with basic input", function() {
    const initialState = {
      open: true,
      title: "My Dialog",
      close: dummyFunc,
      submit: dummyFunc,
      options: mockOptions
    };
    const expectedState = {
      open: false,
      title: "My Dialog",
      close: dummyFunc,
      submit: dummyFunc,
      options: mockOptions
    };

    expect(
      reducer(initialState, {
        type: actions.CLOSE_DIALOG
      })
    ).toEqual(expectedState);
  });

  it("should handle the OPEN_DIALOG action with basic input", function() {
    const expectedState = {
      open: true,
      title: "My Dialog",
      close: dummyFunc,
      submit: dummyFunc,
      options: mockOptions
    };

    expect(
      reducer(DIALOG_INITIAL_STATE, {
        type: actions.OPEN_DIALOG,
        title: "My Dialog",
        close: dummyFunc,
        submit: dummyFunc,
        options: mockOptions
      })
    ).toEqual(expectedState);
  });
});
