import fetch from 'cross-fetch';

//Custom imports
import {
    GET_RECEIPTS_URL,
    ADD_ACTIVE_LABEL,
    REMOVE_ACTIVE_LABEL,
    SERVER_ERROR,
    ERROR_SNACKBAR,
    EDIT_ACTIVE_LABEL,
    CONTENT_TYPE_JSON,
    SNACKBAR_AUTOHIDE_DURATION_DEFAULT
} from '../../../common/constants';
import {
    requestAddActiveLabel,
    requestRemoveActiveLabel,
    receiveAddActiveLabel,
    receiveRemoveActiveLabel,
    requestEditActiveLabel,
    receiveEditActiveLabel
} from './activeLabelsActions';
import { addSnackbar } from '../ui/snackbar/snackbarActions';
import { checkResponseStatus } from '../../utils/fetchUtils';

export function updateActiveLabels(action, label, newLabel, query, activeLabels, currentPage, csrfHeaderName, csrfToken) {
    return function (dispatch) {
        let requestActionCreator = null;
        let responseActionCreator = null;
        let url = new URL('https://' + window.location.host + GET_RECEIPTS_URL);
        let params = {
            query: query,
            pageNum: currentPage
        };

        if (action === ADD_ACTIVE_LABEL) {
            requestActionCreator = requestAddActiveLabel;
            responseActionCreator = receiveAddActiveLabel;
            params.activeLabelNames = [
                ...activeLabels.map(function (el) {
                    return el.name;
                }),
                label.name
            ];
        } else if (action === REMOVE_ACTIVE_LABEL) {
            requestActionCreator = requestRemoveActiveLabel;
            responseActionCreator = receiveRemoveActiveLabel;
            params.activeLabelNames = [
                ...activeLabels.map(function(el) {
                    return el.name;
                })
                .filter(function (name, ind, arr) {
                    return name !== label.name;
                })
            ];
        } else if (action === EDIT_ACTIVE_LABEL) {
            requestActionCreator = requestEditActiveLabel;
            responseActionCreator = receiveEditActiveLabel;
            params.activeLabelNames = [
                ...activeLabels.map(function (el, ind, arr) {
                    return el.name === label.name ? newLabel.name : el.name;
                })
            ];
        }

        //Dispatch appropriate action
        dispatch(requestActionCreator());

        //Create full url
        Object.keys(params).forEach(function(key) {
            if (params[key] && (Array.isArray(params[key]) && params[key].length != 0)) {
                url.searchParams.append(key, params[key])
            }
        });
        return fetch(url, {
            method: 'get',
            headers: {
                'Accept': CONTENT_TYPE_JSON,
                [csrfHeaderName]: csrfToken //Must be sent in the header when using application/json
            }
        })
        .then(function (response) {
            checkResponseStatus(response);
            return response.json();
        })
        .then(function (json) {
            if (action !== EDIT_ACTIVE_LABEL) {
                dispatch(responseActionCreator(label, json.success, json.message));
            } else {
                dispatch(responseActionCreator(newLabel, label, json.success, json.message));
            }

            return Promise.resolve(json);
        })
        .catch(function (error) {
            let newSnackbar = {
                msg: SERVER_ERROR,
                variant: ERROR_SNACKBAR,
                actions: [],
                handlers: [],
                handlerParams: [],
                autohideDuration: SNACKBAR_AUTOHIDE_DURATION_DEFAULT
            };

            if (action !== EDIT_ACTIVE_LABEL) {
                dispatch(responseActionCreator(label, false, SERVER_ERROR));
            } else {
                dispatch(responseActionCreator(newLabel, label, false, SERVER_ERROR));
            }
            dispatch(addSnackbar(newSnackbar));
        });
    }
}