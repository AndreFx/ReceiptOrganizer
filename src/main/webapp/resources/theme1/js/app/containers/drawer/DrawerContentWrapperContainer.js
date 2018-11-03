import {
    connect
} from 'react-redux';

//Custom imports
import DrawerContentWrapper from '../../components/drawer/DrawerContentWrapper';
import {
    fetchUser
} from '../../actions/user/userActions';

function mapStateToProps(state, ownProps) {
    return {
        username: state.user.username,
        isLabelsInitializing: state.labels.isInitializing,
        isUserInitializing: state.user.isInitializing,
        handleDrawerClose: ownProps.handleDrawerClose,
        drawerOpen: ownProps.drawerOpen,
        windowHeight: state.ui.window.height
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUser: () => {
            dispatch(fetchUser());
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContentWrapper);
