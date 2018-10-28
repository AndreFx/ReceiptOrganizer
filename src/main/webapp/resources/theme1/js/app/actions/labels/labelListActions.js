import fetch from 'cross-fetch';

//Custom imports
import {
    GET_LABELS_URL,
    ADD_LABEL_URL,
    DELETE_LABEL_URL,
    SERVER_ERROR,
    SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
    ERROR_SNACKBAR,
    SUCCESS_SNACKBAR,
    EDIT_LABEL_URL
} from '../../../common/constants';
import { addSnackbar } from '../ui/snackbar/snackbarActions';

export const REQUEST_LABELS = 'REQUEST_LABELS';
export const RECEIVE_LABELS = 'RECEIVE_LABELS';
export const REQUEST_ADD_LABEL = 'REQUEST_ADD_LABEL';
export const RECEIVE_ADD_LABEL = 'RECEIVE_ADD_LABEL';
export const REQUEST_DELETE_LABEL = 'REQUEST_DELETE_LABEL';
export const RECEIVE_DELETE_LABEL = 'RECEIVE_DELETE_LABEL';
export const REQUEST_EDIT_LABEL = 'REQUEST_EDIT_LABEL';
export const RECEIVE_EDIT_LABEL = 'RECEIVE_EDIT_LABEL';

function requestLabels() {
    return {
        type: REQUEST_LABELS
    }
}

function receiveLabels(labels, success, msg) {
    return {
        type: RECEIVE_LABELS,
        labels: labels,
        success: success,
        msg: msg
    }
}

export function fetchLabels() {
    return function(dispatch) {
        //Notify that we are beginning a fetch
        dispatch(requestLabels());

        return fetch('https://' + window.location.host + GET_LABELS_URL)
        .then(function(response) {
                checkResponseStatus(response);
                return response.json();
        })
        .then(function(json) {
            dispatch(receiveLabels(json.labels, true, json.message));
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

            dispatch(receiveLabels(null, false, SERVER_ERROR));
            dispatch(addSnackbar(newSnackbar));
        });
    }
}

function requestAddLabel() {
    return {
        type: REQUEST_ADD_LABEL
    }
}

function receiveAddLabel(labelName, success, msg) {
    return {
        type: RECEIVE_ADD_LABEL,
        labelName: labelName,
        success: success,
        msg: msg
    }
}

export function addLabel(labelName, actions, handlers, autohideDuration, csrfHeaderName, csrfToken) {
    return function(dispatch) {
        //Notify that we are beginning a fetch
        dispatch(requestAddLabel());

        return fetch('https://' + window.location.host + ADD_LABEL_URL, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                [csrfHeaderName]: csrfToken //Must be sent in the header when using application/json
            },
            body: JSON.stringify({
                name: labelName
            })
        })
        .then(function(response) {
                checkResponseStatus(response);
                return response.json();
        })
        .then(function(json) {
            let newSnackbar = {
                msg: json.message,
                variant: json.success ? SUCCESS_SNACKBAR : ERROR_SNACKBAR,
                actions: [],
                handlers: [],
                handlerParams: [],
                autohideDuration: SNACKBAR_AUTOHIDE_DURATION_DEFAULT
            };

            dispatch(receiveAddLabel(labelName, json.success, json.message));
            if (!json.success) {
                newSnackbar.actions = actions;
                newSnackbar.handlers = handlers;
                newSnackbar.handlerParams = [
                    [
                        labelName
                    ]
                ];
                newSnackbar.autohideDuration = autohideDuration;
            }

            dispatch(addSnackbar(newSnackbar));

            return Promise.resolve(json);
        })
        .catch(function(error) {
            let newSnackbar = {
                msg: SERVER_ERROR,
                variant: ERROR_SNACKBAR,
                actions: actions,
                handlers: handlers,
                handlerParams: [
                    [
                        labelName
                    ]
                ],
                autohideDuration: autohideDuration
            };

            dispatch(receiveAddLabel(labelName, false, SERVER_ERROR));
            dispatch(addSnackbar(newSnackbar));
        });
    }
}

function requestDeleteLabel() {
    return {
        type: REQUEST_DELETE_LABEL
    }
}

function receiveDeleteLabel(labelName, success, msg) {
    return {
        type: RECEIVE_DELETE_LABEL,
        labelName: labelName,
        success: success,
        msg: msg
    }
}

export function deleteLabel(labelName, csrfHeaderName, csrfToken) {
    return function(dispatch) {
        //Notify that we are beginning a fetch
        dispatch(requestDeleteLabel());

        return fetch('https://' + window.location.host + DELETE_LABEL_URL, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                [csrfHeaderName]: csrfToken //Must be sent in the header when using application/json
            },
            body: JSON.stringify({
                name: labelName
            })
        })
        .then(function(response) {
                checkResponseStatus(response);
                return response.json();
        })
        .then(function(json) {
            let newSnackbar = {
                msg: json.message,
                variant: json.success ? SUCCESS_SNACKBAR : ERROR_SNACKBAR,
                actions: [],
                handlers: [],
                handlerParams: [],
                autohideDuration: SNACKBAR_AUTOHIDE_DURATION_DEFAULT
            };

            dispatch(receiveDeleteLabel(labelName, json.success, json.message));
            dispatch(addSnackbar(newSnackbar));

            return Promise.resolve(json);
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

            dispatch(receiveDeleteLabel(labelName, false, SERVER_ERROR));
            dispatch(addSnackbar(newSnackbar));
        });
    }
}

function requestEditLabel() {
    return {
        type: REQUEST_EDIT_LABEL
    }
}

function receiveEditLabel(newLabelName, oldLabelName, success, msg) {
    return {
        type: RECEIVE_EDIT_LABEL,
        newLabelName: newLabelName,
        oldLabelName: oldLabelName,
        success: success,
        msg: msg
    }
}

export function editLabel(newLabelName, oldLabelName, actions, handlers, autohideDuration, csrfHeaderName, csrfToken) {
    return function(dispatch) {
        //Notify that we are beginning a fetch
        dispatch(requestEditLabel());

        return fetch('https://' + window.location.host + EDIT_LABEL_URL, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                [csrfHeaderName]: csrfToken //Must be sent in the header when using application/json
            },
            body: JSON.stringify({
                newLabel: {
                    name: newLabelName
                },
                oldLabel: {
                    name: oldLabelName
                }
            })
        })
        .then(function(response) {
                checkResponseStatus(response);
                return response.json();
        })
        .then(function(json) {
            //TODO Make utility function for this
            let newSnackbar = {
                msg: json.message,
                variant: json.success ? SUCCESS_SNACKBAR : ERROR_SNACKBAR,
                actions: [],
                handlers: [],
                handlerParams: [],
                autohideDuration: SNACKBAR_AUTOHIDE_DURATION_DEFAULT
            };

            dispatch(receiveEditLabel(newLabelName, oldLabelName, json.success, json.message));
            if (!json.success) {
                newSnackbar.actions = actions;
                newSnackbar.handlers = handlers;
                newSnackbar.handlerParams = [
                    [
                        newLabelName,
                        oldLabelName
                    ]
                ];
                newSnackbar.autohideDuration = autohideDuration;
            }

            dispatch(addSnackbar(newSnackbar));

            return Promise.resolve(json);
        })
        .catch(function(error) {
            //TODO: This will catch errors in previous then as well
            let newSnackbar = {
                msg: SERVER_ERROR,
                variant: ERROR_SNACKBAR,
                actions: actions,
                handlers: handlers,
                handlerParams: [
                    [
                        newLabelName, 
                        oldLabelName
                    ]
                ],
                autohideDuration: autohideDuration
            };

            dispatch(receiveEditLabel(newLabelName, oldLabelName, false, SERVER_ERROR));
            dispatch(addSnackbar(newSnackbar));
        });
    }
}

//Utilities

function checkResponseStatus(response) {
    if (response.status != 200) {
        throw new Error('Bad Response from Server');
    }
}