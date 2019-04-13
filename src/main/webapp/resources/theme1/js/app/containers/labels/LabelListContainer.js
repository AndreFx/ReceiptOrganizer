import { connect } from "react-redux";

//Custom imports
import {
  fetchLabels,
  deleteLabel,
  editLabel
} from "../../actions/labels/labelListActions";
import { openDialog, closeDialog } from "../../actions/ui/dialog/dialogActions";
import LabelList from "../../components/labels/LabelList";
import {
  addActiveLabel,
  editActiveLabel,
  removeActiveLabel
} from "../../actions/receipts/receiptsActions";
import { updateContentView } from "../../actions/ui/content/contentActions";

function mapStateToProps(state, ownProps) {
  return {
    labels: state.labels.items,
    activeLabels: state.activeLabels.items,
    query: state.ui.query,
    currentReceiptPage: state.ui.currentReceiptPage,
    drawerOpen: ownProps.drawerOpen,
    listItemClassName: ownProps.listItemClassName
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchLabels: () => {
      return dispatch(fetchLabels());
    },
    deleteLabel: labelName => {
      return dispatch(deleteLabel(labelName));
    },
    editLabel: (
      newLabelName,
      oldLabelName,
      actions,
      handlers,
      autohideDuration
    ) => {
      return dispatch(
        editLabel(
          newLabelName,
          oldLabelName,
          actions,
          handlers,
          autohideDuration
        )
      );
    },
    closeDialog: () => {
      return dispatch(closeDialog());
    },
    openDialog: (title, submit, close, options) => {
      return dispatch(openDialog(title, submit, close, options));
    },
    addActiveLabel: label => {
      return dispatch(addActiveLabel(label));
    },
    editActiveLabel: (oldLabel, newLabel) => {
      return dispatch(editActiveLabel(oldLabel, newLabel));
    },
    removeActiveLabel: label => {
      return dispatch(removeActiveLabel(label));
    },
    updateContentView: view => {
      return dispatch(updateContentView(view));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LabelList);
