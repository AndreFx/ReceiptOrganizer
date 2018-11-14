import _ from "lodash";

import reducer, { USER_INITIAL_STATE } from "../../../app/reducers/userReducer";
import * as actions from "../../../app/actions/user/userActions";

describe("userReducer", function() {
  it("should return the initial state", function() {
    expect(reducer(USER_INITIAL_STATE, {})).toEqual(USER_INITIAL_STATE);
  });

  it("should handle REQUEST_USER", function() {
    const action = {
      type: actions.REQUEST_USER
    };
    let expectedState = _.cloneDeep(USER_INITIAL_STATE);
    expectedState.isInitializing = true;

    expect(reducer(USER_INITIAL_STATE, action)).toEqual(expectedState);
  });

  it("should handle a successful RECEIVE_USER", function() {
    const userInfo = {
      fName: "MyFirstName",
      lName: "MyLastName",
      username: "MyUsername"
    };
    const action = {
      type: actions.RECEIVE_USER,
      user: userInfo,
      success: true
    };
    let initialState = _.cloneDeep(USER_INITIAL_STATE);
    initialState.isInitializing = true;
    const expectedState = {
      isInitializing: false,
      ...userInfo
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle an unsuccessful RECEIVE_USER", function() {
    const action = {
      type: actions.RECEIVE_USER,
      user: null,
      success: false
    };
    let initialState = _.cloneDeep(USER_INITIAL_STATE);
    initialState.isInitializing = true;

    expect(reducer(initialState, action)).toEqual(USER_INITIAL_STATE);
  });
});
