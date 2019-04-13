import { connect } from "react-redux";

//Custom imports
import NavBar from "../../components/navigation/NavBar";
import { logoutUser } from "../../actions/user/userActions";
import { queryReceipts } from "../../actions/receipts/receiptsActions";
import { updateContentView } from "../../actions/ui/content/contentActions";

function mapStateToProps(state, ownProps) {
  return {
    open: ownProps.open,
    onDrawerBtnClick: ownProps.onDrawerBtnClick
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: (actions, handlers) => {
      return dispatch(logoutUser(actions, handlers));
    },
    queryReceipts: query => {
      dispatch(queryReceipts(query));
    },
    updateContentView: view => {
      dispatch(updateContentView(view));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar);
