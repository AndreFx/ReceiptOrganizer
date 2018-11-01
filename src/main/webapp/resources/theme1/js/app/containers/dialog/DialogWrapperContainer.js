import { connect } from 'react-redux';

//Custom imports
import DialogWrapper from '../../components/dialog/DialogWrapper';

function mapStateToProps(state) {
    return {
        isLoading: state.labels.isLoading,
        dialog: state.ui.dialog
    };
}

export default connect(mapStateToProps) (DialogWrapper);