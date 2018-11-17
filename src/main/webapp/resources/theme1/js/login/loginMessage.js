import React from "react";
import PropTypes from "prop-types";

class LoginMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { error, logout, validateErrors } = this.props;

    let errorContainer;
    if (
      validateErrors.username.length > 0 ||
      validateErrors.password.length > 0
    ) {
      errorContainer = (
        <div
          className="login-form-main-message show invalid"
          id="form-errors-container"
        >
          {" "}
          {Object.keys(validateErrors).map((key, index) => {
            if (validateErrors[key].length > 0) {
              return <div key={key}>{validateErrors[key]}</div>;
            }
          })}
        </div>
      );
    } else if (error) {
      errorContainer = (
        <div
          className="login-form-main-message show invalid"
          id="form-errors-container"
        >
          <p className="submission-status">
            {" "}
            Invalid username and / or password.{" "}
          </p>
        </div>
      );
    } else if (logout) {
      errorContainer = (
        <div
          className="login-form-main-message show success"
          id="form-errors-container"
        >
          <p className="submission-status">
            {" "}
            You have been logged out successfully.{" "}
          </p>
        </div>
      );
    } else {
      errorContainer = (
        <div
          className="login-form-main-message invalid"
          id="form-errors-container"
        />
      );
    }

    return errorContainer;
  }
}

LoginMessage.propTypes = {
  error: PropTypes.bool.isRequired,
  logout: PropTypes.bool.isRequired,
  validateErrors: PropTypes.object
};

export default LoginMessage;
