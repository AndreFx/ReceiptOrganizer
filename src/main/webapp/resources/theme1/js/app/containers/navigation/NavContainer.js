import {
    connect
} from 'react-redux';

//Custom imports
import NavBar from '../../components/navigation/NavBar';

function mapStateToProps(state, ownProps) {
    return {
        csrfParameterName: state.csrf.csrfparametername,
        csrfToken: state.csrf.csrftoken,
        open: ownProps.open,
        onDrawerBtnClick: ownProps.onDrawerBtnClick
    };
}

export default connect(mapStateToProps)(NavBar);
