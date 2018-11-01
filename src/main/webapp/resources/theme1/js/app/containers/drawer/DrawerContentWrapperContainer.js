import { connect } from 'react-redux';

//Custom imports
import DrawerContentWrapper from '../../components/drawer/DrawerContentWrapper';
import { fetchUser } from '../../actions/user/userActions';

function mapStateToProps(state, ownProps) {
    return {
        username: state.user.username,
        handleDrawerClose: ownProps.handleDrawerClose,
        drawerOpen: ownProps.drawerOpen
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUser: () => {
            dispatch(fetchUser());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (DrawerContentWrapper);