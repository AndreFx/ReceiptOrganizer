//Custom imports
import {
  SERVER_ERROR,
  SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
  ERROR_SNACKBAR,
  GET_USER_PATH,
  LOGOUT_USER_PATH,
  CONTENT_TYPE_JSON,
  HOST_URL
} from "../../../common/constants";
import fetchService from "../../../common/utils/fetchService";
import { addSnackbar } from "../ui/snackbar/snackbarActions";

export const REQUEST_USER = "REQUEST_USER";
export const RECEIVE_USER = "RECEIVE_USER";
export const REQUEST_USER_LOGOUT = "REQUEST_USER_LOGOUT";
export const RECEIVE_USER_LOGOUT = "RECEIVE_USER_LOGOUT";

let errorSnackbar = {
  msg: "Failed to logout. Please try again.",
  variant: ERROR_SNACKBAR,
  actions: [],
  handlers: [],
  handlerParams: [],
  autohideDuration: SNACKBAR_AUTOHIDE_DURATION_DEFAULT
};

export function requestUser() {
  return {
    type: REQUEST_USER
  };
}

export function receiveUser(user, success) {
  return {
    type: RECEIVE_USER,
    user: user,
    success: success
  };
}

export function fetchUser() {
  return function(dispatch) {
    //Notify that we are beginning a fetch
    dispatch(requestUser());

    return fetchService
      .doFetch(HOST_URL + GET_USER_PATH)
      .then(function(response) {
        fetchService.checkResponseStatus(response);
        return response.json();
      })
      .then(function(json) {
        dispatch(receiveUser(json.user, true));
      })
      .catch(function(error) {
        let fetchErrorSnackbar = Object.assign({}, errorSnackbar, {
          msg: SERVER_ERROR
        });

        dispatch(receiveUser({}, false));
        dispatch(addSnackbar(fetchErrorSnackbar));
      });
  };
}

export function requestUserLogout() {
  return {
    type: REQUEST_USER_LOGOUT
  };
}

export function receiveUserLogout(success) {
  return {
    type: RECEIVE_USER_LOGOUT,
    success: success
  };
}

export function logoutUser(actions, handlers) {
  return function(dispatch, getState) {
    const state = getState();
    const csrfHeaderName = state.csrf.csrfheadername;
    const csrfToken = state.csrf.csrftoken;
    dispatch(requestUserLogout());

    return fetchService
      .doFetch(HOST_URL + LOGOUT_USER_PATH, {
        method: "post",
        headers: {
          Accept: CONTENT_TYPE_JSON,
          "Content-Type": CONTENT_TYPE_JSON,
          [csrfHeaderName]: csrfToken
        }
      })
      .then(function(response) {
        fetchService.checkResponseStatus(response);
        dispatch(receiveUserLogout(true));

        //Allow UI to react to success status
        return Promise.resolve(true);
      })
      .catch(function(error) {
        let logoutErrSnackbar = Object.assign({}, errorSnackbar, {
          actions: actions,
          handlers: handlers
        });

        dispatch(receiveUserLogout(false));
        dispatch(addSnackbar(logoutErrSnackbar));

        return Promise.resolve(false);
      });
  };
}
