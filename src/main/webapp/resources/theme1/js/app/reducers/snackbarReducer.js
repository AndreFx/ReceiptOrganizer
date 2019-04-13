//Custom imports
import {
  PROCESS_SNACKBAR_QUEUE,
  FINISH_CURRENT_SNACKBAR,
  ADD_SNACKBAR
} from "../actions/ui/snackbar/snackbarActions";

export const SNACKBAR_INITIAL_STATE = {
  currentSnackbar: null,
  snackbarOpen: false,
  snackbarQueue: []
};

function snackbarReducer(state, action) {
  switch (action.type) {
    case PROCESS_SNACKBAR_QUEUE:
      if (state.snackbarQueue.length > 1) {
        return Object.assign({}, state, {
          currentSnackbar: state.snackbarQueue[0],
          snackbarOpen: true,
          snackbarQueue: [...state.snackbarQueue.slice(1)]
        });
      } else if (state.snackbarQueue.length == 1) {
        return Object.assign({}, state, {
          currentSnackbar: state.snackbarQueue[0],
          snackbarOpen: true,
          snackbarQueue: []
        });
      } else {
        return state;
      }
    case FINISH_CURRENT_SNACKBAR:
      return Object.assign({}, state, {
        snackbarOpen: false
      });
    case ADD_SNACKBAR:
      if (state.snackbarOpen) {
        return Object.assign({}, state, {
          snackbarOpen: false,
          snackbarQueue: [...state.snackbarQueue, action.newSnackbar]
        });
      } else {
        return Object.assign({}, state, {
          currentSnackbar: action.newSnackbar,
          snackbarOpen: true
        });
      }
    default:
      return state;
  }
}

export default snackbarReducer;
