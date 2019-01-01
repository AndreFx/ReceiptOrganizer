import { connect } from "react-redux";

import {
  editReceipt,
  refreshReceipts
} from "../../actions/receipts/receiptsActions";
import ReceiptEdit from "../../components/receipts/ReceiptEdit";

function mapStateToProps(state, ownProps) {
  return {
    isLoading: state.receipts.isLoading,
    labels: state.labels.items
  };
}

function mapDispatchToProps(dispatch) {
  return {
    editReceipt: updatedReceipt => {
      return dispatch(editReceipt(updatedReceipt));
    },
    refreshReceipts: () => {
      return dispatch(refreshReceipts());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceiptEdit);
