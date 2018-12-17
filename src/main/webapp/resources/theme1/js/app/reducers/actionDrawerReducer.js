import { RECEIPT_CREATION } from "../../common/constants";
import { UPDATE_ACTION_DRAWER_VIEW } from "../actions/ui/actionDrawer/actionDrawerActions";

export const ACTION_DRAWER_INITIAL_STATE = {
  view: RECEIPT_CREATION
};

function actionDrawerReducer(state, action) {
  switch (action.type) {
    case UPDATE_ACTION_DRAWER_VIEW:
      return Object.assign({}, state, {
        view: action.view
      });
    default:
      return state;
  }
}

export default actionDrawerReducer;
