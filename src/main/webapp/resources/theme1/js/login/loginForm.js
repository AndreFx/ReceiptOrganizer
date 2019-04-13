import React from "react";
import PropTypes from "prop-types";
import LoginMessage from "./loginMessage";
import {
  INVALID_PASSWORD_MESSAGE,
  INVALID_USERNAME_MESSAGE,
  SNACKBAR_AUTOHIDE_DURATION_DEFAULT
} from "../common/constants";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      formErrors: {
        username: "",
        password: ""
      },
      usernameValid: false,
      passwordValid: false,
      formValid: false,
      logout: false,
      error: false,
      intervalID: null
    };

    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateField = this.validateField.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onEnterPressed = this.onEnterPressed.bind(this);
    this.removeServerMessages = this.removeServerMessages.bind(this);
  }

  handleUserInput(event) {
    const name = event.target.name;
    const value = event.target.value;
    if (this.state.error || this.state.logout) {
      clearInterval(this.state.intervalID);
      this.setState(
        {
          [name]: value,
          successfulSubmit: undefined,
          error: false,
          logout: false
        },
        () => {
          this.validateField(name, value);
        }
      );
    } else {
      this.setState(
        {
          [name]: value,
          successfulSubmit: undefined
        },
        () => {
          this.validateField(name, value);
        }
      );
    }
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let usernameValid = this.state.usernameValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case "username":
        usernameValid = value.length !== 0;
        fieldValidationErrors.username = usernameValid
          ? ""
          : INVALID_USERNAME_MESSAGE;
        break;
      case "password":
        passwordValid = value.length !== 0;
        fieldValidationErrors.password = passwordValid
          ? ""
          : INVALID_PASSWORD_MESSAGE;
        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: fieldValidationErrors,
        usernameValid: usernameValid,
        passwordValid: passwordValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.usernameValid && this.state.passwordValid
    });
  }

  handleSubmit(event) {
    const validForm = this.state.formValid;
    if (validForm) {
      console.log("Valid login form submitted, sending to server");
      this.setState({
        successfulSubmit: true
      });
    } else {
      let fieldValidationErrors = this.state.formErrors;
      let usernameValid = this.state.usernameValid;
      let passwordValid = this.state.passwordValid;

      if (this.state.username.length === 0) {
        usernameValid = false;
        fieldValidationErrors.username = INVALID_USERNAME_MESSAGE;
      }
      if (this.state.password.length === 0) {
        passwordValid = false;
        fieldValidationErrors.password = INVALID_PASSWORD_MESSAGE;
      }

      this.setState({
        formErrors: fieldValidationErrors,
        formValid: usernameValid && passwordValid,
        successfulSubmit: false
      });
      event.preventDefault();
    }
  }

  onEnterPressed(event) {
    if (event.keyCode == 13 && event.shiftKey == false) {
      event.preventDefault();
      this.loginButton.click();
    }
  }

  removeServerMessages() {
    if (this.state.error || this.state.logout) {
      this.setState({
        error: false,
        logout: false
      });
      clearInterval(this.state.intervalID);
    }
  }

  componentDidMount() {
    const { error, logout } = this.props;

    let intervalID = setInterval(
      this.removeServerMessages,
      SNACKBAR_AUTOHIDE_DURATION_DEFAULT
    );

    this.setState({
      error: error ? true : false,
      logout: logout ? true : false,
      intervalID: intervalID
    });
  }

  render() {
    const submitStatus = this.state.successfulSubmit;
    let button;

    if (submitStatus) {
      button = (
        <button
          ref={el => (this.loginButton = el)}
          type="submit"
          className="success clicked login-button"
        >
          <i className="fa fa-check"> </i>
        </button>
      );
    } else if (submitStatus === undefined) {
      button = (
        <button
          ref={el => (this.loginButton = el)}
          type="submit"
          className="login-button"
        >
          <i className="fa fa-chevron-right"> </i>{" "}
        </button>
      );
    } else {
      button = (
        <button
          ref={el => (this.loginButton = el)}
          type="submit"
          className="error clicked login-button"
        >
          <i className="fa fa-times"> </i>{" "}
        </button>
      );
    }

    return (
      <div className="login-form">
        <form
          ref={el => (this.loginFormEl = el)}
          method="post"
          action={this.props.loginUrl}
          id="loginForm"
          className="text-left"
          autoComplete="off"
          onSubmit={event => this.handleSubmit(event)}
        >
          <LoginMessage
            error={this.state.error}
            logout={this.state.logout}
            validateErrors={this.state.formErrors}
          />
          <div className="main-login-form">
            <div className="login-group">
              <div className="form-group">
                <label htmlFor="lg_username" className="sr-only">
                  {" "}
                  Username{" "}
                </label>
                <input
                  name="username"
                  type="text"
                  className="form-control"
                  id="lg_username"
                  placeholder="username"
                  value={this.state.username}
                  onChange={event => this.handleUserInput(event)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lg_password" className="sr-only">
                  {" "}
                  Password{" "}
                </label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  id="lg_password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={event => this.handleUserInput(event)}
                  onKeyDown={event => this.onEnterPressed(event)}
                />
                <input
                  type="hidden"
                  name={this.props.csrfParameterName}
                  value={this.props.csrfToken}
                />
              </div>
            </div>
            {button}
          </div>
        </form>
      </div>
    );
  }
}

LoginForm.propTypes = {
  loginUrl: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  logout: PropTypes.string.isRequired,
  csrfParameterName: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired
};

export default LoginForm;
