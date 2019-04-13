import reducer, {
  SNACKBAR_INITIAL_STATE
} from "../../../app/reducers/snackbarReducer";
import * as actions from "../../../app/actions/ui/snackbar/snackbarActions";
import { SNACKBAR_ACTION_RETRY } from "../../../common/constants";

describe("snackbarReducer", function() {
  const dummyHandler = function(defaultValue) {
    return null;
  };

  const mockSnackbar = {
    msg: "Snackbar!",
    actions: [SNACKBAR_ACTION_RETRY],
    handlers: [dummyHandler],
    handlerParams: ["defaultValue"]
  };
  const noHandlerSnackbar = {
    msg: "Snackbar!",
    actions: [],
    handlers: [],
    handlerParams: []
  };

  it("should return the initial state", function() {
    expect(reducer(SNACKBAR_INITIAL_STATE, {})).toEqual(SNACKBAR_INITIAL_STATE);
  });

  it("should handle ADD_SNACKBAR when snackbar closed", function() {
    const action = {
      type: actions.ADD_SNACKBAR,
      newSnackbar: mockSnackbar
    };
    const expectedState = {
      snackbarOpen: true,
      currentSnackbar: mockSnackbar,
      snackbarQueue: []
    };

    expect(reducer(SNACKBAR_INITIAL_STATE, action)).toEqual(expectedState);
  });

  it("should handle ADD_SNACKBAR when snackbar open", function() {
    const action = {
      type: actions.ADD_SNACKBAR,
      newSnackbar: mockSnackbar
    };
    const expectedState = {
      snackbarOpen: false,
      currentSnackbar: mockSnackbar,
      snackbarQueue: [mockSnackbar]
    };
    const snackbarOpenInitState = {
      currentSnackbar: mockSnackbar,
      snackbarOpen: true,
      snackbarQueue: []
    };

    expect(reducer(snackbarOpenInitState, action)).toEqual(expectedState);
  });

  it("should handle FINISH_CURRENT_SNACKBAR", function() {
    const action = {
      type: actions.FINISH_CURRENT_SNACKBAR
    };
    const expectedState = {
      snackbarOpen: false,
      currentSnackbar: null,
      snackbarQueue: []
    };

    expect(reducer(SNACKBAR_INITIAL_STATE, action)).toEqual(expectedState);
  });

  it("should handle PROCESS_SNACKBAR_QUEUE when queue is empty", function() {
    const action = {
      type: actions.PROCESS_SNACKBAR_QUEUE
    };
    const initialState = {
      snackbarQueue: [],
      snackbarOpen: false,
      currentSnackbar: mockSnackbar
    };

    expect(reducer(initialState, action)).toEqual(initialState);
  });

  it("should handle PROCESS_SNACKBAR_QUEUE when queue is length 1", function() {
    const action = {
      type: actions.PROCESS_SNACKBAR_QUEUE
    };
    const initialState = {
      snackbarQueue: [mockSnackbar],
      snackbarOpen: false,
      currentSnackbar: null
    };
    const expectedState = {
      snackbarQueue: [],
      snackbarOpen: true,
      currentSnackbar: mockSnackbar
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle PROCESS_SNACKBAR_QUEUE when queue length is greater than 1", function() {
    const action = {
      type: actions.PROCESS_SNACKBAR_QUEUE
    };
    const initialState = {
      snackbarQueue: [mockSnackbar, mockSnackbar],
      snackbarOpen: false,
      currentSnackbar: noHandlerSnackbar
    };
    const expectedState = {
      snackbarQueue: [mockSnackbar],
      snackbarOpen: true,
      currentSnackbar: mockSnackbar
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});
