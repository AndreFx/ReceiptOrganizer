const React = require('react');
const ReactDOM = require('react-dom');

class OrganizerApp extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="text-center login" style={containerStyle}>
			    <div className="logo">login</div>
                
	        </div>
        );
    }
}

//Render application
var root = document.getElementById('react');
ReactDOM.render(
    <OrganizerApp {...(root.dataset)}/>, 
    document.getElementById('react')
)