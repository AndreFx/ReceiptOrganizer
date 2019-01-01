import { connect } from "react-redux";

import ReceiptCreationStepper from "../../components/receipts/ReceiptCreationStepper";
import { addSnackbar } from "../../actions/ui/snackbar/snackbarActions";

function mapStateToProps(state, ownProps) {
  return {
    isLoading: state.receipts.isLoading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addSnackbar: snackbar => {
      return dispatch(addSnackbar(snackbar));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceiptCreationStepper);
