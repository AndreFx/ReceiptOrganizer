import { RECEIPT_CREATION } from "../../common/constants";
import {
  UPDATE_ACTION_DRAWER_VIEW,
  TOGGLE_ACTION_DRAWER
} from "../actions/ui/actionDrawer/actionDrawerActions";

export const ACTION_DRAWER_INITIAL_STATE = {
  view: RECEIPT_CREATION,
  options: null,
  open: false
};

function actionDrawerReducer(state, action) {
  switch (action.type) {
    case TOGGLE_ACTION_DRAWER:
      return Object.assign({}, state, {
        open: action.open
      });
    case UPDATE_ACTION_DRAWER_VIEW:
      return Object.assign({}, state, {
        view: action.view,
        options: action.options
      });
    default:
      return state;
  }
}

export default actionDrawerReducer;
