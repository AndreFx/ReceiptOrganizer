import { RECEIPT_LIBRARY } from "../../common/constants";
import { UPDATE_CONTENT_VIEW } from "../actions/ui/content/contentActions";

export const CONTENT_INITIAL_STATE = {
  view: RECEIPT_LIBRARY
};

function contentReducer(state, action) {
  switch (action.type) {
    case UPDATE_CONTENT_VIEW:
      return Object.assign({}, state, {
        view: action.view
      });
    default:
      return state;
  }
}

export default contentReducer;
