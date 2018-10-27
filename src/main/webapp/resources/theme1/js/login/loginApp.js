import React from 'react';
import ReactDOM from 'react-dom';
import LoginForm from './loginForm';

class LoginApp extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const containerStyle = {
            padding: '50px 0'
        };

        return (
            <div className="text-center login" style={containerStyle}>
			    <div className="logo">login</div>
                <LoginForm error={this.props.error} logout={this.props.logout} loginUrl={this.props.loginurl} csrfToken={this.props.csrftoken} csrfParameterName={this.props.csrfparametername} />
	        </div>
        );
    }
}

//Render login application
var root = document.getElementById('react');
ReactDOM.render(
    <LoginApp {...(root.dataset)}/>, 
    root
);