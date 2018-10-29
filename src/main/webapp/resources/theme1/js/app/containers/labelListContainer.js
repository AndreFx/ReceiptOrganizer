import { connect } from 'react-redux';

//Custom imports
import { fetchLabels, deleteLabel, editLabel } from '../actions/labels/labelListActions';
import { openDialog, closeDialog } from '../actions/ui/dialog/dialogActions';
import LabelList from '../components/labels/labelList';
import { updateActiveLabels } from '../actions/receipts/receiptsActions';

function mapStateToProps(state) {
    return {
        csrfHeaderName: state.csrf.csrfheadername,
        csrfToken: state.csrf.csrftoken,
        labels: state.labels.items,
        activeLabels: state.activeLabels.items,
        query: state.ui.query,
        currentReceiptPage: state.ui.currentReceiptPage
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchLabels: () => {
            return dispatch(fetchLabels());
        },
        deleteLabel: (labelName, csrfHeaderName, csrfToken) => {
            return dispatch(deleteLabel(labelName, csrfHeaderName, csrfToken));
        },
        editLabel: (newLabelName, oldLabelName, actions, handlers, autohideDuration, csrfHeaderName, csrfToken) => {
            return dispatch(editLabel(newLabelName, oldLabelName, actions, handlers, autohideDuration, csrfHeaderName, csrfToken));
        },
        closeDialog: () => {
            return dispatch(closeDialog());
        },
        openDialog: (title, submit, close, options) => {
            return dispatch(openDialog(title, submit, close, options));
        },
        updateActiveLabels: (action, label, newLabel, query, activeLabels, currentPage, csrfHeaderName, csrfToken) => {
            return dispatch(updateActiveLabels(action, label, newLabel, query, activeLabels, currentPage, csrfHeaderName, csrfToken));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (LabelList);