import { connect } from "react-redux";

//Custom imports
import ContentWrapper from "../../components/content/ContentWrapper";
import {
  removeActiveLabel,
  loadReceiptPage,
  queryReceipts
} from "../../actions/receipts/receiptsActions";

function mapStateToProps(state, ownProps) {
  return {
    activeLabels: state.activeLabels.items,
    query: state.receipts.query,
    currentPage: state.receipts.currentPage,
    numPages: state.receipts.numPages,
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
    loadReceiptPage: pageNum => {
      return dispatch(loadReceiptPage(pageNum));
    },
    queryReceipts: query => {
      return dispatch(queryReceipts(query));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentWrapper);
