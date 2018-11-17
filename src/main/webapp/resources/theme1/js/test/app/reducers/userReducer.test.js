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
    const expectedState = Object.assign({}, USER_INITIAL_STATE, {
      isInitializing: true
    });
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
    const initialState = Object.assign({}, USER_INITIAL_STATE, {
      isInitializing: true
    });
    const expectedState = {
      isInitializing: false,
      isLoading: false,
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
    const initialState = Object.assign({}, USER_INITIAL_STATE, {
      isInitializing: true
    });

    expect(reducer(initialState, action)).toEqual(USER_INITIAL_STATE);
  });

  it("should handle REQUEST_USER_LOGOUT", function() {
    const action = {
      type: actions.REQUEST_USER_LOGOUT
    };
    const expectedState = Object.assign({}, USER_INITIAL_STATE, {
      isLoading: true
    });

    expect(reducer(USER_INITIAL_STATE, action)).toEqual(expectedState);
  });

  it("should handle a successful RECEIVE_USER_LOGOUT", function() {
    const action = {
      type: actions.RECEIVE_USER_LOGOUT
    };
    const initialState = Object.assign({}, USER_INITIAL_STATE, {
      isLoading: true
    });
    const expectedState = Object.assign({}, initialState, {
      isLoading: false
    });

    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});
