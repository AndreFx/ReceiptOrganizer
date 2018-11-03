import { connect } from "react-redux";

//Custom imports
import ContentWrapper from "../../components/content/ContentWrapper";
import { updateActiveLabels } from "../../actions/receipts/receiptsActions";

function mapStateToProps(state, ownProps) {
  return {
    csrfHeaderName: state.csrf.csrfheadername,
    csrfToken: state.csrf.csrftoken,
    activeLabels: state.activeLabels.items,
    isLoading: state.receipts.isLoading,
    drawerOpen: ownProps.drawerOpen,
    windowWidth: state.ui.window.width,
    windowHeight: state.ui.window.height
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateActiveLabels: (
      action,
      label,
      newLabel,
      query,
      activeLabels,
      currentPage,
      csrfHeaderName,
      csrfToken
    ) => {
      return dispatch(
        updateActiveLabels(
          action,
          label,
          newLabel,
          query,
          activeLabels,
          currentPage,
          csrfHeaderName,
          csrfToken
        )
      );
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentWrapper);
