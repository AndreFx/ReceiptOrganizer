import { connect } from 'react-redux';

//Custom imports
import OrganizerApp from '../components/OrganizerApp';
import { processSnackbarQueue, finishCurrentSnackbar } from '../actions/ui/snackbar/snackbarActions';

function mapStateToProps(state) {
    return {
        isLoading: state.labels.isLoading || state.receipts.isLoading,
        currentSnackbar: state.ui.snackbar.currentSnackbar,
        snackbarOpen: state.ui.snackbar.snackbarOpen,
        snackbarQueueLength: state.ui.snackbar.snackbarQueue.length,
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