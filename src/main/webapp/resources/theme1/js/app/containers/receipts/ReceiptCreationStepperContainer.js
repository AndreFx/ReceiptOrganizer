import { connect } from "react-redux";

import {
  uploadReceipt,
  editReceipt
} from "../../actions/receipts/receiptsActions";
import ReceiptCreationStepper from "../../components/receipts/ReceiptCreationStepper";
import { addSnackbar } from "../../actions/ui/snackbar/snackbarActions";

function mapStateToProps(state, ownProps) {
  return {
    isLoading: state.receipts.isLoading,
    labels: state.labels.items
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addSnackbar: snackbar => {
      return dispatch(addSnackbar(snackbar));
    },
    uploadReceipt: (skipOcr, receiptFile) => {
      return dispatch(uploadReceipt(skipOcr, receiptFile));
    },
    editReceipt: updatedReceipt => {
      return dispatch(editReceipt(updatedReceipt));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceiptCreationStepper);
