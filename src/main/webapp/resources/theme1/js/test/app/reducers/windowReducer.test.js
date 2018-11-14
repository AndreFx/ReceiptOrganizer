import _ from "lodash";

import reducer, {
  WINDOW_INITIAL_STATE
} from "../../../app/reducers/windowReducer";
import * as actions from "../../../app/actions/ui/window/windowActions";

describe("windowReducer", function() {
  it("should return the initial state", function() {
    expect(reducer(WINDOW_INITIAL_STATE, {})).toEqual(WINDOW_INITIAL_STATE);
  });

  it("should handle UPDATE_WINDOW_DIMENSIONS", function() {
    const action = {
      type: actions.UPDATE_WINDOW_DIMENSIONS,
      width: 2000,
      height: 2000
    };
    let expectedState = _.cloneDeep(action);
    expectedState.type = undefined;

    expect(reducer(WINDOW_INITIAL_STATE, action)).toEqual(expectedState);
  });
});
