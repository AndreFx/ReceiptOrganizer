//Custom imports
import { CLOSE_DIALOG, OPEN_DIALOG } from "../actions/ui/dialog/dialogActions";

export const DIALOG_INITIAL_STATE = {
    open: false,
    title: null,
    close: null,
    submit: null,
    options: null
};

function dialogReducer(state = initialState, action) {
    switch(action.type) {
        case CLOSE_DIALOG:
            return Object.assign({}, state, {
                open: false
            });
        case OPEN_DIALOG:
            return Object.assign({}, state, {
                open: true,
                title: action.title,
                submit: action.submit,
                close: action.close,
                options: action.options
            });
        default:
            return state;
    }
}

export default dialogReducer;