import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import rootReducer from "../reducers/indexReducer";
import AppContainer from "./AppContainer";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import MomentUtils from "@date-io/moment";

const loggerMiddleware = createLogger();
const root = document.getElementById("react");
const initialState = {
  csrf: {
    ...root.dataset
  }
};
const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunkMiddleware, loggerMiddleware)
);

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    htmlFontSize: 16
  },
  palette: {
    primary: red
  }
});

class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <AppContainer />
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default Root;
