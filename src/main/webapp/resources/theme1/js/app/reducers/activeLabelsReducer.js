//Custom imports
import { 
    REQUEST_ADD_ACTIVE_LABEL,
    RECEIVE_ADD_ACTIVE_LABEL, 
    RECEIVE_REMOVE_ACTIVE_LABEL,
    REQUEST_REMOVE_ACTIVE_LABEL
} from '../actions/receipts/activeLabelsActions';

function activeLabels(state = {
    //TODO: Maybe put this loading in the receipt state structure
    isLoading: false,
    items: []
}, action) {
    switch (action.type) {
        case REQUEST_ADD_ACTIVE_LABEL:
        case REQUEST_REMOVE_ACTIVE_LABEL:
            return Object.assign({}, state, {
                isLoading: true
            });
        case RECEIVE_ADD_ACTIVE_LABEL:
            if (action.success) {
                return Object.assign({}, state, {
                    isLoading: false,
                    items: [
                        ...state.items,
                        action.label
                    ]
                });
            } else {
                return Object.assign({}, state, {
                    isLoading: false
                });
            }
        case RECEIVE_REMOVE_ACTIVE_LABEL:
            if (action.success) {
                return Object.assign({}, state, {
                    isLoading: false,
                    items: [
                        ...state.items.filter(function(el, ind, arr) {
                            return el.name !== action.label.name;
                        })
                    ]
                });
            } else {
                return Object.assign({}, state, {
                    isLoading: false
                });
            }
        default:
            return state;
    }
};

export default activeLabels;