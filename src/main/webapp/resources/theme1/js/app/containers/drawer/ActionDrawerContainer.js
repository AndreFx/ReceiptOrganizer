import { connect } from "react-redux";
import ActionDrawer from "../../components/drawer/ActionDrawer";
import { toggleActionDrawer } from "../../actions/ui/actionDrawer/actionDrawerActions";

function mapStateToProps(state, ownProps) {
  return {
    open: state.ui.actionDrawer.open,
    view: state.ui.actionDrawer.view,
    options: state.ui.actionDrawer.options,
    isLabelsLoading: state.labels.isLoading,
    isReceiptsLoading: state.receipts.isLoading,
    isUserLoading: state.user.isLoading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleActionDrawer: open => {
      dispatch(toggleActionDrawer(open));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionDrawer);
