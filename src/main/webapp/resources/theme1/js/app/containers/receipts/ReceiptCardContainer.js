import { connect } from "react-redux";

import { deleteReceipt } from "../../actions/receipts/receiptsActions";
import ReceiptCard from "../../components/receipts/ReceiptCard";
import { closeDialog, openDialog } from "../../actions/ui/dialog/dialogActions";
import {
  toggleActionDrawer,
  updateActionDrawerView
} from "../../actions/ui/actionDrawer/actionDrawerActions";

function mapStateToProps(state, ownProps) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    deleteReceipt: id => {
      return dispatch(deleteReceipt(id));
    },
    closeDialog: () => {
      return dispatch(closeDialog());
    },
    openDialog: (title, submit, close, options) => {
      return dispatch(openDialog(title, submit, close, options));
    },
    toggleActionDrawer: open => {
      return dispatch(toggleActionDrawer(open));
    },
    updateActionDrawerView: (view, options) => {
      return dispatch(updateActionDrawerView(view, options));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceiptCard);
