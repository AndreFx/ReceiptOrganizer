import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";

import * as actions from "../../../../app/actions/user/userActions";
import * as snackbarActions from "../../../../app/actions/ui/snackbar/snackbarActions";
import * as constants from "../../../../common/constants";
import { USER_INITIAL_STATE } from "../../../../app/reducers/userReducer";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("userActions", function() {
  const errorSnackbar = {
    msg: constants.SERVER_ERROR,
    variant: constants.ERROR_SNACKBAR,
    actions: [],
    handlers: [],
    handlerParams: [],
    autohideDuration: constants.SNACKBAR_AUTOHIDE_DURATION_DEFAULT
  };
  const mockUser = {
    fName: "First Name",
    lName: "Last Name",
    username: "MyUsername"
  };

  describe("fetchUser action creators", function() {
    it("should create an action to request user info", function() {
      const expectedAction = {
        type: actions.REQUEST_USER
      };

      expect(actions.requestUser()).toEqual(expectedAction);
    });

    it("should create an action to receive fetched user info", function() {
      const expectedAction = {
        type: actions.RECEIVE_USER,
        user: mockUser,
        success: true
      };

      expect(actions.receiveUser(mockUser, true)).toEqual(expectedAction);
    });
  });

  describe("userLogout action creators", function() {
    it("should create an action to request a logout", function() {
      const expectedAction = {
        type: actions.REQUEST_USER_LOGOUT
      };

      expect(actions.requestUserLogout()).toEqual(expectedAction);
    });

    it("should create an action to receive a logout status", function() {
      const expectedAction = {
        type: actions.RECEIVE_USER_LOGOUT,
        success: true
      };

      expect(actions.receiveUserLogout(true)).toEqual(expectedAction);
    });
  });

  describe("fetchUser", function() {
    afterEach(function() {
      fetchMock.restore();
    });

    it("creates REQUEST and RECEIVE actions for fetchUser", function() {
      const expectedActions = [
        {
          type: actions.REQUEST_USER
        },
        {
          type: actions.RECEIVE_USER,
          user: mockUser,
          success: true
        }
      ];

      fetchMock.getOnce(constants.HOST_URL + constants.GET_USER_PATH, {
        body: {
          success: true,
          user: mockUser,
          message: "Success"
        },
        status: 200,
        headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
      });
      const store = mockStore({ user: USER_INITIAL_STATE });

      return store.dispatch(actions.fetchUser()).then(function() {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("creates REQUEST, RECEIVE and ADD_SNACKBAR actions for an unsuccessful fetchUser", function() {
      const expectedActions = [
        {
          type: actions.REQUEST_USER
        },
        {
          type: actions.RECEIVE_USER,
          user: {},
          success: false
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: errorSnackbar
        }
      ];

      fetchMock.getOnce(constants.HOST_URL + constants.GET_USER_PATH, {
        body: {
          success: false,
          message: "Failure"
        },
        status: 404,
        headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
      });
      const store = mockStore({
        user: USER_INITIAL_STATE
      });

      return store.dispatch(actions.fetchUser()).then(function() {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("logoutUser", function() {
    const snackbarRetryActions = ["Retry"];
    const dummyHandler = function() {
      return null;
    };
    const handlers = [dummyHandler];

    afterEach(function() {
      fetchMock.restore();
    });

    it("creates REQUEST and RECEIVE actions for logoutUser", function() {
      const expectedActions = [
        {
          type: actions.REQUEST_USER_LOGOUT
        },
        {
          type: actions.RECEIVE_USER_LOGOUT,
          success: true
        }
      ];

      fetchMock.postOnce(constants.HOST_URL + constants.LOGOUT_USER_PATH, {
        body: {},
        status: 200,
        headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
      });
      const store = mockStore({
        user: USER_INITIAL_STATE,
        csrf: {
          csrfheadername: "HEADER",
          csrftoken: "MyToken"
        }
      });

      return store
        .dispatch(actions.logoutUser(snackbarRetryActions, handlers))
        .then(function() {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("creates REQUEST, RECEIVE and ADD_SNACKBAR actions for an unsuccessful logoutUser", function() {
      const expectedActions = [
        {
          type: actions.REQUEST_USER_LOGOUT
        },
        {
          type: actions.RECEIVE_USER_LOGOUT,
          success: false
        },
        {
          type: snackbarActions.ADD_SNACKBAR,
          newSnackbar: Object.assign({}, errorSnackbar, {
            msg: "Failed to logout. Please try again.",
            actions: snackbarRetryActions,
            handlers
          })
        }
      ];

      fetchMock.postOnce(constants.HOST_URL + constants.LOGOUT_USER_PATH, {
        body: {},
        status: 404,
        headers: { "Content-Type": constants.CONTENT_TYPE_JSON }
      });
      const store = mockStore({
        user: USER_INITIAL_STATE,
        csrf: {
          csrfheadername: "HEADER",
          csrftoken: "MYTOKEN"
        }
      });

      return store
        .dispatch(actions.logoutUser(snackbarRetryActions, handlers))
        .then(function() {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });
});
