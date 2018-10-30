import React from 'react';

class LoginMessage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const isError = this.props.error;
        const isLogout = this.props.logout;
        const validateErrors = this.props.validateErrors;

        let errorContainer;
        if (isError) {
            errorContaner = <div className="login-form-main-message show invalid" id="form-errors-container"><p className="submission-status">Invalid username and/or password.</p></div>;
        } else if (isLogout) {
            errorContainer = <div className="login-form-main-message show success" id="form-errors-container"><p className="submission-status">You have been logged out successfully.</p></div>;
        } else if (validateErrors.username.length > 0 || validateErrors.password.length > 0) {
            errorContainer = <div className="login-form-main-message show invalid" id="form-errors-container">
                                {Object.keys(validateErrors).map((key, index) => {
                                    if (validateErrors[key].length > 0) {
                                        return (<div key={key} >{validateErrors[key]}</div>);
                                    }
                                })}
                            </div>;
        } else {
            errorContainer = <div className="login-form-main-message invalid" id="form-errors-container"></div>;
        }

        return errorContainer;
    }
}

export default LoginMessage;