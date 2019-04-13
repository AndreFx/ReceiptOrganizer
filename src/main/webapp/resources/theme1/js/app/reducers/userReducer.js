//Custom imports
import {
  REQUEST_USER,
  RECEIVE_USER,
  REQUEST_USER_LOGOUT,
  RECEIVE_USER_LOGOUT
} from "../actions/user/userActions";
import {
  DEFAULT_FNAME,
  DEFAULT_LNAME,
  DEFAULT_USERNAME
} from "../../common/constants";

export const USER_INITIAL_STATE = {
  isInitializing: false,
  isLoading: false,
  fName: DEFAULT_FNAME,
  lName: DEFAULT_LNAME,
  username: DEFAULT_USERNAME
};

function userReducer(state = USER_INITIAL_STATE, action) {
  switch (action.type) {
    case RECEIVE_USER:
      if (action.success) {
        return Object.assign({}, state, {
          isInitializing: false,
          ...action.user
        });
      } else {
        return Object.assign({}, state, {
          isInitializing: false
        });
      }
    case RECEIVE_USER_LOGOUT:
      return Object.assign({}, state, {
        isLoading: false
      });
    case REQUEST_USER:
      return Object.assign({}, state, {
        isInitializing: true
      });
    case REQUEST_USER_LOGOUT:
      return Object.assign({}, state, {
        isLoading: true
      });
    default:
      return state;
  }
}

export default userReducer;
