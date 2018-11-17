import { connect } from "react-redux";

//Custom imports
import ContentWrapper from "../../components/content/ContentWrapper";
import { removeActiveLabel } from "../../actions/receipts/receiptsActions";

function mapStateToProps(state, ownProps) {
  return {
    activeLabels: state.activeLabels.items,
    query: state.receipts.query,
    currentPage: state.receipts.currentPage,
    isLoading: state.receipts.isLoading,
    drawerOpen: ownProps.drawerOpen,
    windowWidth: state.ui.window.width,
    windowHeight: state.ui.window.height
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeActiveLabel: label => {
      return dispatch(removeActiveLabel(label));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentWrapper);
