import { connect } from "react-redux";

import {
  uploadReceipt,
  refreshReceipts
} from "../../actions/receipts/receiptsActions";
import ReceiptCreationUpload from "../../components/receipts/ReceiptUpload";

function mapStateToProps(state, ownProps) {
  return {
    isLoading: state.receipts.isLoading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uploadReceipt: (skipOcr, receiptFile) => {
      return dispatch(uploadReceipt(skipOcr, receiptFile));
    },
    refreshReceipts: () => {
      return dispatch(refreshReceipts());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceiptCreationUpload);
