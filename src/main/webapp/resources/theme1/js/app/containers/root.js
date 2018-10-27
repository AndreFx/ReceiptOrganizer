import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import red from '@material-ui/core/colors/red';

//Custom imports
import rootReducer from '../reducers/indexReducer';
import AppContainer from '../containers/appContainer';

const loggerMiddleware = createLogger();
//TODO: Don't love this being here
const root = document.getElementById('react');
const initialState = {
    csrf: {
        ...(root.dataset)
    }
};
const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
        htmlFontSize: 16
    },
    palette: {
        primary: red,
    }
});

class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <AppContainer />
                </MuiThemeProvider>
            </Provider>
        );
    }
}

export default Root;