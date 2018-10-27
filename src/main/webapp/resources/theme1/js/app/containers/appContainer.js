import { connect } from 'react-redux';

//Custom imports
import OrganizerApp from '../components/organizerApp';
import { processSnackbarQueue, finishCurrentSnackbar } from '../actions/ui/snackbar/snackbarActions';

function mapStateToProps(state) {
    return {
        isLoading: state.labels.isLoading,
        currentSnackbar: state.ui.snackbar.currentSnackbar,
        snackbarOpen: state.ui.snackbar.snackbarOpen,
        snackbarQueueLength: state.ui.snackbar.snackbarQueue.length,
        dialog: state.ui.dialog
    };
}

function mapDispatchToProps(dispatch) {
    return {
        processSnackbarQueue: () => {
            dispatch(processSnackbarQueue());
        },
        finishCurrentSnackbar: () => {
            dispatch(finishCurrentSnackbar());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (OrganizerApp);