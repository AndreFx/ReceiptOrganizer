import { connect } from "react-redux";

//Custom imports
import ContentWrapper from "../../components/content/ContentWrapper";
import {
  removeActiveLabel,
  changeReceiptPage
} from "../../actions/receipts/receiptsActions";

function mapStateToProps(state, ownProps) {
  return {
    activeLabels: state.activeLabels.items,
    query: state.receipts.query,
    currentPage: state.receipts.currentPage,
    receipts: state.receipts.items,
    isLoading: state.receipts.isFullLoading,
    drawerOpen: ownProps.drawerOpen,
    windowWidth: state.ui.window.width,
    windowHeight: state.ui.window.height,
    view: state.ui.content.view
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeActiveLabel: label => {
      return dispatch(removeActiveLabel(label));
    },
    changeReceiptPage: pageNum => {
      return dispatch(changeReceiptPage(pageNum));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentWrapper);
