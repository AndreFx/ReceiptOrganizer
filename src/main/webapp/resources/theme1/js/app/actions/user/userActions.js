import fetch from 'cross-fetch';

//Custom imports
import {
    SERVER_ERROR,
    SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
    ERROR_SNACKBAR,
    GET_USER_URL
} from '../../../common/constants';
import { checkResponseStatus } from '../../utils/fetchUtils';
import { addSnackbar } from '../ui/snackbar/snackbarActions';

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';

function requestUser() {
    return {
        type: REQUEST_USER
    }
}

function receiveUser(user, success, msg) {
    return {
        type: RECEIVE_USER,
        user: user,
        success: success,
        msg: msg
    }
}

export function fetchUser() {
    return function(dispatch) {
        //Notify that we are beginning a fetch
        dispatch(requestUser());

        return fetch('https://' + window.location.host + GET_USER_URL)
        .then(function(response) {
                checkResponseStatus(response);
                return response.json();
        })
        .then(function(json) {
            dispatch(receiveUser(json.user, true, json.message));
        })
        .catch(function(error) {
            let newSnackbar = {
                msg: SERVER_ERROR,
                variant: ERROR_SNACKBAR,
                actions: [],
                handlers: [],
                handlerParams: [],
                autohideDuration: SNACKBAR_AUTOHIDE_DURATION_DEFAULT
            };

            dispatch(receiveUser(null, false, SERVER_ERROR));
            dispatch(addSnackbar(newSnackbar));
        });
    }
}