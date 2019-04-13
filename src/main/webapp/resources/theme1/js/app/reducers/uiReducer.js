//Custom imports
import {
  ADD_SNACKBAR,
  PROCESS_SNACKBAR_QUEUE,
  FINISH_CURRENT_SNACKBAR
} from "../actions/ui/snackbar/snackbarActions";
import snackbarReducer, { SNACKBAR_INITIAL_STATE } from "./snackbarReducer";
import dialogReducer, { DIALOG_INITIAL_STATE } from "./dialogReducer";
import windowReducer, { WINDOW_INITIAL_STATE } from "./windowReducer";
import { OPEN_DIALOG, CLOSE_DIALOG } from "../actions/ui/dialog/dialogActions";
import { UPDATE_WINDOW_DIMENSIONS } from "../actions/ui/window/windowActions";
import { UPDATE_CONTENT_VIEW } from "../actions/ui/content/contentActions";
import contentReducer, { CONTENT_INITIAL_STATE } from "./contentReducer";
import {
  UPDATE_ACTION_DRAWER_VIEW,
  TOGGLE_ACTION_DRAWER
} from "../actions/ui/actionDrawer/actionDrawerActions";
import actionDrawerReducer, {
  ACTION_DRAWER_INITIAL_STATE
} from "./actionDrawerReducer";

export const UI_INITIAL_STATE = {
  snackbar: SNACKBAR_INITIAL_STATE,
  dialog: DIALOG_INITIAL_STATE,
  window: WINDOW_INITIAL_STATE,
  content: CONTENT_INITIAL_STATE,
  actionDrawer: ACTION_DRAWER_INITIAL_STATE
};

function uiReducer(state = UI_INITIAL_STATE, action) {
  switch (action.type) {
    case PROCESS_SNACKBAR_QUEUE:
    case FINISH_CURRENT_SNACKBAR:
    case ADD_SNACKBAR:
      return {
        ...state,
        snackbar: snackbarReducer(state.snackbar, action)
      };
    case OPEN_DIALOG:
    case CLOSE_DIALOG:
      return {
        ...state,
        dialog: dialogReducer(state.dialog, action)
      };
    case UPDATE_WINDOW_DIMENSIONS:
      return {
        ...state,
        window: windowReducer(state.window, action)
      };
    case UPDATE_CONTENT_VIEW:
      return {
        ...state,
        content: contentReducer(state.content, action)
      };
    case UPDATE_ACTION_DRAWER_VIEW:
    case TOGGLE_ACTION_DRAWER:
      return {
        ...state,
        actionDrawer: actionDrawerReducer(state.actionDrawer, action)
      };
    default:
      return state;
  }
}

export default uiReducer;
