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
  CONTENT_TYPE_JSON,
  HOST_URL
} from "../../../common/constants";
import fetchService from "../../../common/utils/fetchService";
import { addSnackbar } from "../ui/snackbar/snackbarActions";

export const REQUEST_LABELS = "REQUEST_LABELS";
export const RECEIVE_LABELS = "RECEIVE_LABELS";
export const REQUEST_ADD_LABEL = "REQUEST_ADD_LABEL";
export const RECEIVE_ADD_LABEL = "RECEIVE_ADD_LABEL";
export const REQUEST_DELETE_LABEL = "REQUEST_DELETE_LABEL";
export const RECEIVE_DELETE_LABEL = "RECEIVE_DELETE_LABEL";
export const REQUEST_EDIT_LABEL = "REQUEST_EDIT_LABEL";
export const RECEIVE_EDIT_LABEL = "RECEIVE_EDIT_LABEL";

const errorSnackbar = {
  msg: SERVER_ERROR,
  variant: ERROR_SNACKBAR,
  actions: [],
  handlers: [],
  handlerParams: [],
  autohideDuration: SNACKBAR_AUTOHIDE_DURATION_DEFAULT
};

function requestLabels() {
  return {
    type: REQUEST_LABELS
  };
}

function receiveLabels(labels, success) {
  return {
    type: RECEIVE_LABELS,
    labels: labels,
    success: success
  };
}

export function fetchLabels() {
  return function(dispatch) {
    //Notify that we are beginning a fetch
    dispatch(requestLabels());

    return fetchService
      .doFetch(HOST_URL + GET_LABELS_PATH)
      .then(function(response) {
        fetchService.checkResponseStatus(response);
        return response.json();
      })
      .then(function(json) {
        dispatch(receiveLabels(json.labels, json.success));
        return Promise.resolve(json.success);
      })
      .catch(function(error) {
        dispatch(receiveLabels(null, false));
        dispatch(addSnackbar(errorSnackbar));
        return Promise.resolve(false);
      });
  };
}

function requestAddLabel() {
  return {
    type: REQUEST_ADD_LABEL
  };
}

function receiveAddLabel(label, success) {
  return {
    type: RECEIVE_ADD_LABEL,
    label: label,
    success: success
  };
}

export function addLabel(label, actions, handlers, autohideDuration) {
  return function(dispatch, getState) {
    const state = getState();
    const csrfHeaderName = state.csrf.csrfheadername;
    const csrfToken = state.csrf.csrftoken;
    dispatch(requestAddLabel());

    return fetchService
      .doFetch(HOST_URL + ADD_LABEL_PATH, {
        method: "post",
        headers: {
          Accept: CONTENT_TYPE_JSON,
          "Content-Type": CONTENT_TYPE_JSON,
          [csrfHeaderName]: csrfToken //Must be sent in the header when using application/json
        },
        body: JSON.stringify(label)
      })
      .then(function(response) {
        fetchService.checkResponseStatus(response);
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

        dispatch(receiveAddLabel(label, json.success));
        if (!json.success) {
          newSnackbar.actions = actions;
          newSnackbar.handlers = handlers;
          newSnackbar.handlerParams = [[label.name]];
          newSnackbar.autohideDuration = autohideDuration;
        }

        dispatch(addSnackbar(newSnackbar));

        return Promise.resolve(json.success);
      })
      .catch(function(error) {
        const addErrorSnackbar = Object.assign({}, errorSnackbar, {
          actions,
          handlers,
          handlerParams: [[label.name]],
          autohideDuration
        });
        dispatch(receiveAddLabel(label, false));
        dispatch(addSnackbar(addErrorSnackbar));
        return Promise.resolve(false);
      });
  };
}

function requestDeleteLabel() {
  return {
    type: REQUEST_DELETE_LABEL
  };
}

function receiveDeleteLabel(label, success) {
  return {
    type: RECEIVE_DELETE_LABEL,
    label: label,
    success: success
  };
}

export function deleteLabel(label) {
  return function(dispatch, getState) {
    const state = getState();
    const csrfHeaderName = state.csrf.csrfheadername;
    const csrfToken = state.csrf.csrftoken;
    dispatch(requestDeleteLabel());

    return fetchService
      .doFetch(HOST_URL + DELETE_LABEL_PATH, {
        method: "post",
        headers: {
          Accept: CONTENT_TYPE_JSON,
          "Content-Type": CONTENT_TYPE_JSON,
          [csrfHeaderName]: csrfToken //Must be sent in the header when using application/json
        },
        body: JSON.stringify(label)
      })
      .then(function(response) {
        fetchService.checkResponseStatus(response);
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

        dispatch(receiveDeleteLabel(label, json.success));
        dispatch(addSnackbar(newSnackbar));

        return Promise.resolve(json.success);
      })
      .catch(function(error) {
        dispatch(receiveDeleteLabel(label, false));
        dispatch(addSnackbar(errorSnackbar));
        return Promise.resolve(false);
      });
  };
}

function requestEditLabel() {
  return {
    type: REQUEST_EDIT_LABEL
  };
}

function receiveEditLabel(newLabel, oldLabel, success) {
  return {
    type: RECEIVE_EDIT_LABEL,
    newLabel: newLabel,
    oldLabel: oldLabel,
    success: success
  };
}

export function editLabel(
  newLabel,
  oldLabel,
  actions,
  handlers,
  autohideDuration
) {
  return function(dispatch, getState) {
    const state = getState();
    const csrfHeaderName = state.csrf.csrfheadername;
    const csrfToken = state.csrf.csrftoken;
    dispatch(requestEditLabel());

    return fetchService
      .doFetch(HOST_URL + EDIT_LABEL_PATH, {
        method: "post",
        headers: {
          Accept: CONTENT_TYPE_JSON,
          "Content-Type": CONTENT_TYPE_JSON,
          [csrfHeaderName]: csrfToken //Must be sent in the header when using application/json
        },
        body: JSON.stringify({
          newLabel: newLabel,
          oldLabel: oldLabel
        })
      })
      .then(function(response) {
        fetchService.checkResponseStatus(response);
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

        dispatch(receiveEditLabel(newLabel, oldLabel, json.success));
        if (!json.success) {
          newSnackbar.actions = actions;
          newSnackbar.handlers = handlers;
          newSnackbar.handlerParams = [[newLabel.name]];
          newSnackbar.autohideDuration = autohideDuration;
        }

        dispatch(addSnackbar(newSnackbar));

        return Promise.resolve(json.success);
      })
      .catch(function(error) {
        const editErrorSnackber = Object.assign({}, errorSnackbar, {
          actions,
          handlers,
          handlerParams: [[newLabel.name]],
          autohideDuration
        });
        dispatch(receiveEditLabel(newLabel, oldLabel, false));
        dispatch(addSnackbar(editErrorSnackber));
        return Promise.resolve(false);
      });
  };
}
