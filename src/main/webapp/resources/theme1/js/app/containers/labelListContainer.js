import { connect } from 'react-redux';

//Custom imports
import { fetchLabels, deleteLabel } from '../actions/labels/labelListActions';
import LabelList from '../components/labels/labelList';

function mapStateToProps(state) {
    return {
        csrfHeaderName: state.csrf.csrfheadername,
        csrfToken: state.csrf.csrftoken,
        labels: state.labels.items
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchLabels: () => {
            return dispatch(fetchLabels());
        },
        deleteLabel: (labelName, csrfHeaderName, csrfToken) => {
            return dispatch(deleteLabel(labelName, csrfHeaderName, csrfToken));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (LabelList);