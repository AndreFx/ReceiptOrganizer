//Custom imports
import {
    RECEIVE_LABELS,
    REQUEST_LABELS,
    RECEIVE_ADD_LABEL,
    REQUEST_ADD_LABEL,
    RECEIVE_DELETE_LABEL,
    REQUEST_DELETE_LABEL,
    REQUEST_EDIT_LABEL,
    RECEIVE_EDIT_LABEL
} from '../actions/labels/labelListActions';

function compare(a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase())
        return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase())
        return 1;
    return 0;
}

function labels(state = {
        isInitializing: false,
        isLoading: false,
        items: []
    }, 
    action
) {
    switch (action.type) {
        case RECEIVE_LABELS:
            if (action.success) {
                return Object.assign({}, state, {
                    isInitializing: false,
                    items: action.labels
                });
            } else {
                return Object.assign({}, state, {
                    isInitializing: false
                });
            }
        case RECEIVE_ADD_LABEL:
            if (action.success) {
                return Object.assign({}, state, {
                    isLoading: false,
                    items: [
                        ...state.items,
                        action.label
                    ].sort(compare)
                });
            } else {
                return Object.assign({}, state, {
                    isLoading: false
                });
            }
        case RECEIVE_DELETE_LABEL:
            if (action.success) {
                return Object.assign({}, state, {
                    isLoading: false,
                    items: [
                        ...state.items.filter(function(value, index, arr) {
                            return value.name !== action.label.name
                        })
                    ]
                });
            } else {
                return Object.assign({}, state, {
                    isLoading: false
                });
            }
        case RECEIVE_EDIT_LABEL:
            if (action.success) {
                return Object.assign({}, state, {
                    isLoading: false,
                    items: [
                        ...state.items.map(function(value, index, arr) {
                            return value.name === action.oldLabel.name ? action.newLabel : value;
                        }).sort(compare)
                    ]
                });
            } else {
                return Object.assign({}, state, {
                    isLoading: false
                });
            }
        case REQUEST_LABELS:
            return Object.assign({}, state, {
                isInitializing: true
            });
        case REQUEST_ADD_LABEL:
        case REQUEST_DELETE_LABEL:
        case REQUEST_EDIT_LABEL:
            return Object.assign({}, state, {
                isLoading: true
            });
        default:
            return state;
    }
};

export default labels;