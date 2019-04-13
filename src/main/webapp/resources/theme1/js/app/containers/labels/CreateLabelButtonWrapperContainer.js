import { connect } from "react-redux";

//Custom imports
import { addLabel } from "../../actions/labels/labelListActions";
import { openDialog, closeDialog } from "../../actions/ui/dialog/dialogActions";
import CreateLabelButtonWrapper from "../../components/labels/CreateLabelButtonWrapper";

function mapStateToProps(state) {
  return {
    isLoading: state.labels.isLoading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addLabel: (labelName, actions, handlers, autohideDuration) => {
      return dispatch(addLabel(labelName, actions, handlers, autohideDuration));
    },
    closeDialog: () => {
      return dispatch(closeDialog());
    },
    openDialog: (title, submit, close, options) => {
      return dispatch(openDialog(title, submit, close, options));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateLabelButtonWrapper);
