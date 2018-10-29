import { connect } from 'react-redux';

//Custom imports
import OrganizerApp from '../components/organizerApp';
import { processSnackbarQueue, finishCurrentSnackbar } from '../actions/ui/snackbar/snackbarActions';
import { updateActiveLabels } from '../actions/receipts/receiptsActions';

function mapStateToProps(state) {
    return {
        isLoading: state.labels.isLoading || state.activeLabels.isLoading,
        currentSnackbar: state.ui.snackbar.currentSnackbar,
        snackbarOpen: state.ui.snackbar.snackbarOpen,
        snackbarQueueLength: state.ui.snackbar.snackbarQueue.length,
        dialog: state.ui.dialog,
        activeLabels: state.activeLabels.items,
        query: state.ui.query,
        currentReceiptPage: state.ui.currentReceiptPage,
        csrfHeaderName: state.csrf.csrfheadername,
        csrfToken: state.csrf.csrftoken
    };
}

function mapDispatchToProps(dispatch) {
    return {
        processSnackbarQueue: () => {
            dispatch(processSnackbarQueue());
        },
        finishCurrentSnackbar: () => {
            dispatch(finishCurrentSnackbar());
        },
        updateActiveLabels: (action, label, newLabel, query, activeLabels, currentPage, csrfHeaderName, csrfToken) => {
            return dispatch(updateActiveLabels(action, label, newLabel, query, activeLabels, currentPage, csrfHeaderName, csrfToken));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (OrganizerApp);