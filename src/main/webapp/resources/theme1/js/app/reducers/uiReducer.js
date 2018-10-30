//Custom imports
import { ADD_SNACKBAR, PROCESS_SNACKBAR_QUEUE, FINISH_CURRENT_SNACKBAR } from "../actions/ui/snackbar/snackbarActions";
import snackbarReducer, { SNACKBAR_INITIAL_STATE } from "./snackbarReducer";
import dialogReducer, { DIALOG_INITIAL_STATE } from "./dialogReducer";
import { OPEN_DIALOG, CLOSE_DIALOG } from "../actions/ui/dialog/dialogActions";

function uiReducer(state = {
    snackbar: SNACKBAR_INITIAL_STATE,
    dialog: DIALOG_INITIAL_STATE
}, action) {
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
        default:
            return state;
    }
};

export default uiReducer;