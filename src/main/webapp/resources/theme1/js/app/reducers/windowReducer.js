//Custom imports
import {
    UPDATE_WINDOW_DIMENSIONS
} from '../actions/ui/window/windowActions';

export const WINDOW_INITIAL_STATE = {
    width: 1024,
    height: 768
};

function windowReducer(state, action) {
    switch (action.type) {
        case UPDATE_WINDOW_DIMENSIONS:
            return Object.assign({}, state, {
                width: action.width,
                height: action.height
            });
        default:
            return state;
    }
}

export default windowReducer;
