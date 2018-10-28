import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';

import { 
    CREATE_LABEL_UI_TITLE,
    SNACKBAR_ACTION_RETRY,
    SNACKBAR_AUTOHIDE_DISABLED,
    CREATE_LABEL_DIALOG_HELP,
    CREATE_LABEL_CANCEL,
    CREATE_LABEL_SUBMIT,
    CREATE_LABEL_DIALOG_INPUT_PLACEHOLDER
} from '../../../common/constants';

class CreateLabelButtonWrapper extends React.Component {
    constructor(props) {
        super(props);

        //Bind functions in constructor so a new function isn't made in every render
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleClickOpen(event, value) {
        let options = {
            dialogText: CREATE_LABEL_DIALOG_HELP,
            textFields: [
                {
                    label: CREATE_LABEL_DIALOG_INPUT_PLACEHOLDER,
                    defaultValue: value ? value : ""
                }
            ],
            cancelText: CREATE_LABEL_CANCEL,
            submitText: CREATE_LABEL_SUBMIT
        };

        this.props.openDialog(CREATE_LABEL_UI_TITLE, this.handleSubmit, this.props.closeDialog, options);
    }

    handleSubmit({ CategoryName }) {
        this.props.addLabel(
            CategoryName,
            [
                SNACKBAR_ACTION_RETRY
            ],
            [
                this.handleClickOpen
            ],
            SNACKBAR_AUTOHIDE_DISABLED,
            this.props.csrfHeaderName, 
            this.props.csrfToken
        );
    }

    render() {
        return (
            <List>
                <ListItem button key={CREATE_LABEL_UI_TITLE} onClick={this.handleClickOpen}>
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary={CREATE_LABEL_UI_TITLE} />
                </ListItem>
            </List>
        );
    }
}

CreateLabelButtonWrapper.propTypes = {
    csrfHeaderName: PropTypes.string.isRequired,
    csrfToken: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    openDialog: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired
};

export default CreateLabelButtonWrapper;