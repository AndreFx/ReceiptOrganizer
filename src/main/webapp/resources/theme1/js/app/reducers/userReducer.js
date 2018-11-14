//Custom imports
import { REQUEST_USER, RECEIVE_USER } from "../actions/user/userActions";
import {
  DEFAULT_FNAME,
  DEFAULT_LNAME,
  DEFAULT_USERNAME
} from "../../common/constants";

export const USER_INITIAL_STATE = {
  isInitializing: false,
  fName: DEFAULT_FNAME,
  lName: DEFAULT_LNAME,
  username: DEFAULT_USERNAME
};

function dialogReducer(state = USER_INITIAL_STATE, action) {
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
    case REQUEST_USER:
      return Object.assign({}, state, {
        isInitializing: true
      });
    default:
      return state;
  }
}

export default dialogReducer;
