//Custom imports
import { REQUEST_USER, RECEIVE_USER } from "../actions/user/userActions";
import { DEFAULT_FNAME, DEFAULT_LNAME, DEFAULT_USERNAME } from '../../common/constants';

function dialogReducer(state = null, action) {
    switch(action.type) {
        case RECEIVE_USER:
            if (action.success) {
                return Object.assign({}, state, action.user);
            } else {
                return Object.assign({}, state, null);
            }
        case REQUEST_USER:
        default:
            return state;
    }
}

export default dialogReducer;