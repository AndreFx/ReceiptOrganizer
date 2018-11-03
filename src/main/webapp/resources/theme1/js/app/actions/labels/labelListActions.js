//Custom imports
import {
    GET_LABELS_PATH,
    ADD_LABEL_PATH,
    DELETE_LABEL_PATH,
    SERVER_ERROR,
    SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
    ERROR_SNACKBAR,
    SUCCESS_SNACKBAR,
    EDIT_LABEL_PATH,
    CONTENT_TYPE_JSON
} from '../../../common/constants';
import doFetch, {
    checkResponseStatus
} from '../../../common/utils/fetchService';
import {
    addSnackbar
} from '../ui/snackbar/snackbarActions';

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
    };
}

function receiveLabels(labels, success, msg) {
    return {
        type: RECEIVE_LABELS,
        labels: labels,
        success: success,
        msg: msg
    };
}

export function fetchLabels() {
    return function(dispatch) {
        //Notify that we are beginning a fetch
        dispatch(requestLabels());

        return doFetch(GET_LABELS_PATH)
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
    };
}

function requestAddLabel() {
    return {
        type: REQUEST_ADD_LABEL
    };
}

function receiveAddLabel(label, success, msg) {
    return {
        type: RECEIVE_ADD_LABEL,
        label: label,
        success: success,
        msg: msg
    };
}

export function addLabel(label, actions, handlers, autohideDuration, csrfHeaderName, csrfToken) {
    return function(dispatch) {
        //Notify that we are beginning a fetch
        dispatch(requestAddLabel());

        return doFetch(ADD_LABEL_PATH, {
                method: 'post',
                headers: {
                    'Accept': CONTENT_TYPE_JSON,
                    'Content-Type': CONTENT_TYPE_JSON,
                    [csrfHeaderName]: csrfToken //Must be sent in the header when using application/json
                },
                body: JSON.stringify(label)
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

                dispatch(receiveAddLabel(label, json.success, json.message));
                if (!json.success) {
                    newSnackbar.actions = actions;
                    newSnackbar.handlers = handlers;
                    newSnackbar.handlerParams = [
                        [
                            label.name
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
                            label.name
                        ]
                    ],
                    autohideDuration: autohideDuration
                };

                dispatch(receiveAddLabel(label, false, SERVER_ERROR));
                dispatch(addSnackbar(newSnackbar));
            });
    };
}

function requestDeleteLabel() {
    return {
        type: REQUEST_DELETE_LABEL
    };
}

function receiveDeleteLabel(label, success, msg) {
    return {
        type: RECEIVE_DELETE_LABEL,
        label: label,
        success: success,
        msg: msg
    };
}

export function deleteLabel(label, csrfHeaderName, csrfToken) {
    return function(dispatch) {
        //Notify that we are beginning a fetch
        dispatch(requestDeleteLabel());

        return doFetch(DELETE_LABEL_PATH, {
                method: 'post',
                headers: {
                    'Accept': CONTENT_TYPE_JSON,
                    'Content-Type': CONTENT_TYPE_JSON,
                    [csrfHeaderName]: csrfToken //Must be sent in the header when using application/json
                },
                body: JSON.stringify(label)
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

                dispatch(receiveDeleteLabel(label, json.success, json.message));
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

                dispatch(receiveDeleteLabel(label, false, SERVER_ERROR));
                dispatch(addSnackbar(newSnackbar));
            });
    };
}

function requestEditLabel() {
    return {
        type: REQUEST_EDIT_LABEL
    };
}

function receiveEditLabel(newLabel, oldLabel, success, msg) {
    return {
        type: RECEIVE_EDIT_LABEL,
        newLabel: newLabel,
        oldLabel: oldLabel,
        success: success,
        msg: msg
    };
}

export function editLabel(newLabel, oldLabel, actions, handlers, autohideDuration, csrfHeaderName, csrfToken) {
    return function(dispatch) {
        //Notify that we are beginning a fetch
        dispatch(requestEditLabel());

        return doFetch(EDIT_LABEL_PATH, {
                method: 'post',
                headers: {
                    'Accept': CONTENT_TYPE_JSON,
                    'Content-Type': CONTENT_TYPE_JSON,
                    [csrfHeaderName]: csrfToken //Must be sent in the header when using application/json
                },
                body: JSON.stringify({
                    newLabel: newLabel,
                    oldLabel: oldLabel
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

                dispatch(receiveEditLabel(newLabel, oldLabel, json.success, json.message));
                if (!json.success) {
                    newSnackbar.actions = actions;
                    newSnackbar.handlers = handlers;
                    newSnackbar.handlerParams = [
                        [
                            newLabel.name
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
                            newLabel.name
                        ]
                    ],
                    autohideDuration: autohideDuration
                };

                dispatch(receiveEditLabel(newLabel, oldLabel, false, SERVER_ERROR));
                dispatch(addSnackbar(newSnackbar));
            });
    };
}
