import fetch from 'cross-fetch';

//Custom imports
import { GET_RECEIPTS_URL, ADD_ACTIVE_LABEL, REMOVE_ACTIVE_LABEL, SERVER_ERROR, ERROR_SNACKBAR } from '../../../common/constants';
import {
    requestAddActiveLabel,
    requestRemoveActiveLabel,
    receiveAddActiveLabel,
    receiveRemoveActiveLabel
} from './activeLabelsActions';
import { addSnackbar } from '../ui/snackbar/snackbarActions';
import { checkResponseStatus } from '../../utils/fetchUtils';

export function updateActiveLabels(action, label, query, activeLabels, currentPage, csrfHeaderName, csrfToken) {
    return function(dispatch) {
        let requestActionCreator = null;
        let responseActionCreator = null;
        let body = {
            query: query,
            pageNum: currentPage
        }
        if (action === ADD_ACTIVE_LABEL) {
            requestActionCreator = requestAddActiveLabel;
            responseActionCreator = receiveAddActiveLabel;
            body.activeLabels = [
                ...activeLabels,
                label
            ];
        } else if (action === REMOVE_ACTIVE_LABEL) {
            requestActionCreator = requestRemoveActiveLabel;
            responseActionCreator = receiveRemoveActiveLabel;
            body.activeLabels = [
                ...activeLabels.filter(function(el, ind, arr) {
                    return el.name !== label.name;
                })
            ];
        }

        //Dispatch appropriate action
        dispatch(requestActionCreator());
        
        return fetch('https://' + window.location.host + GET_RECEIPTS_URL, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                [csrfHeaderName]: csrfToken //Must be sent in the header when using application/json
            },
            body: JSON.stringify(body)
        })
        .then(function(response) {
                checkResponseStatus(response);
                return response.json();
        })
        .then(function(json) {
            dispatch(responseActionCreator(label, json.success, json.message));

            return Promise.resolve(json);
        })
        .catch(function(error) {
            let newSnackbar = {
                msg: SERVER_ERROR,
                variant: ERROR_SNACKBAR,
                actions: [],
                handlers: [],
                handlerParams: []
            };

            dispatch(responseActionCreator(label, false, SERVER_ERROR));
            dispatch(addSnackbar(newSnackbar));
        });
    }
}