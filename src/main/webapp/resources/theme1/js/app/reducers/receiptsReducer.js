//Custom imports
import {
  REQUEST_ADD_ACTIVE_LABEL,
  RECEIVE_ADD_ACTIVE_LABEL,
  RECEIVE_REMOVE_ACTIVE_LABEL,
  REQUEST_REMOVE_ACTIVE_LABEL,
  REQUEST_EDIT_ACTIVE_LABEL,
  RECEIVE_EDIT_ACTIVE_LABEL
} from "../actions/receipts/activeLabelsActions";

export const RECEIPTS_INITIAL_STATE = {
  isLoading: false
};

function receipts(state = RECEIPTS_INITIAL_STATE, action) {
  switch (action.type) {
    case REQUEST_ADD_ACTIVE_LABEL:
    case REQUEST_REMOVE_ACTIVE_LABEL:
    case REQUEST_EDIT_ACTIVE_LABEL:
      return Object.assign({}, state, {
        isLoading: true
      });
    case RECEIVE_ADD_ACTIVE_LABEL:
    case RECEIVE_REMOVE_ACTIVE_LABEL:
    case RECEIVE_EDIT_ACTIVE_LABEL:
      return Object.assign({}, state, {
        isLoading: false
      });
    default:
      return state;
  }
}

export default receipts;
