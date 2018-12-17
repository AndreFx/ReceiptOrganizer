import { connect } from "react-redux";

import { uploadReceipt } from "../../actions/receipts/receiptsActions";
import ReceiptCreationStepper from "../../components/receipts/ReceiptCreationStepper";

function mapStateToProps(state, ownProps) {
  return {
    isLoading: state.receipts.isLoading,
    labels: state.labels.items
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uploadReceipt: (skipOcr, receiptFile) => {
      return dispatch(uploadReceipt(skipOcr, receiptFile));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceiptCreationStepper);
