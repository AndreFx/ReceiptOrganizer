//Custom imports
import {
    RECEIVE_LABELS,
    REQUEST_LABELS,
    RECEIVE_ADD_LABEL,
    REQUEST_ADD_LABEL,
    RECEIVE_DELETE_LABEL,
    REQUEST_DELETE_LABEL
} from '../actions/labels/labelListActions';

function compare(a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase())
        return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase())
        return 1;
    return 0;
}

function labels(state = {
        isLoading: false,
        items: []
    }, 
    action
) {
    switch (action.type) {
        case RECEIVE_LABELS:
            return Object.assign({}, state, {
                isLoading: false,
                items: action.labels
            });
        case RECEIVE_ADD_LABEL:
            if (action.success) {
                return Object.assign({}, state, {
                    isLoading: false,
                    items: [
                        ...state.items,
                        {
                            name: action.labelName
                        }
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
                            return value.name !== action.labelName
                        })
                    ]
                });
            } else {
                return Object.assign({}, state, {
                    isLoading: false
                });
            }
        case REQUEST_LABELS:
        case REQUEST_ADD_LABEL:
        case REQUEST_DELETE_LABEL:
            return Object.assign({}, state, {
                isLoading: true
            });
        default:
            return state;
    }
};

export default labels;