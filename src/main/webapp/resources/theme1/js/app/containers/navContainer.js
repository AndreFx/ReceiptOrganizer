import { connect } from 'react-redux';
import NavBar from '../components/navigation/nav';

function mapStateToProps(state) {
    return {
        csrfParameterName: state.csrf.csrfparametername,
        csrfToken: state.csrf.csrftoken
    };
}

export default connect(mapStateToProps) (NavBar);