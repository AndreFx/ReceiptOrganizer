import { connect } from "react-redux";

//Custom imports
import OrganizerApp from "../components/OrganizerApp";
import {
  processSnackbarQueue,
  finishCurrentSnackbar
} from "../actions/ui/snackbar/snackbarActions";
import { updateWindowDimensions } from "../actions/ui/window/windowActions";
import { updateActionDrawerView } from "../actions/ui/actionDrawer/actionDrawerActions";

function mapStateToProps(state) {
  return {
    isLoading:
      state.labels.isLoading ||
      state.receipts.isLoading ||
      state.user.isLoading,
    currentSnackbar: state.ui.snackbar.currentSnackbar,
    snackbarOpen: state.ui.snackbar.snackbarOpen,
    snackbarQueueLength: state.ui.snackbar.snackbarQueue.length,
    windowWidth: state.ui.window.width,
    actionDrawerView: state.ui.actionDrawer.view
  };
}

function mapDispatchToProps(dispatch) {
  return {
    processSnackbarQueue: () => {
      dispatch(processSnackbarQueue());
    },
    finishCurrentSnackbar: () => {
      dispatch(finishCurrentSnackbar());
    },
    updateWindowDimensions: (width, height) => {
      dispatch(updateWindowDimensions(width, height));
    },
    updateActionDrawerView: view => {
      dispatch(updateActionDrawerView(view));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizerApp);
