import { connect } from 'react-redux';

//Custom imports
import ContentWrapper from '../../components/content/ContentWrapper';
import { updateActiveLabels } from '../../actions/receipts/receiptsActions';

function mapStateToProps(state) {
    return {
        csrfHeaderName: state.csrf.csrfheadername,
        csrfToken: state.csrf.csrftoken,
        activeLabels: state.activeLabels.items,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateActiveLabels: (action, label, newLabel, query, activeLabels, currentPage, csrfHeaderName, csrfToken) => {
            return dispatch(updateActiveLabels(action, label, newLabel, query, activeLabels, currentPage, csrfHeaderName, csrfToken));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (ContentWrapper);