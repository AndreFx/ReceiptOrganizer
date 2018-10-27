import { connect } from 'react-redux';

//Custom imports
import { addLabel } from '../actions/labels/labelListActions';
import { openDialog, closeDialog } from '../actions/ui/dialog/dialogActions';
import CreateLabelList from '../components/labels/createLabelList';

function mapStateToProps(state) {
    return {
        csrfHeaderName: state.csrf.csrfheadername,
        csrfToken: state.csrf.csrftoken,
        isLoading: state.labels.isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addLabel: (labelName, actions, handlers, autohideDuration, csrfHeaderName, csrfToken) => {
            return dispatch(addLabel(labelName, actions, handlers, autohideDuration, csrfHeaderName, csrfToken));
        },
        closeDialog: () => {
            return dispatch(closeDialog());
        },
        openDialog: (title, submit, close, options) => {
            return dispatch(openDialog(title, submit, close, options));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (CreateLabelList);