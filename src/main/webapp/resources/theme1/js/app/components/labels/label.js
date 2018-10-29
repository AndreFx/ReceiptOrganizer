import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ReceiptIcon from '@material-ui/icons/Receipt';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';

//Custom Imports
import { 
    ITEM_HEIGHT,
    LABEL_MENU_OPTIONS,
    LABEL_MENU_DELETE,
    LABEL_MENU_EDIT,
    EDIT_LABEL_DIALOG_HELP,
    EDIT_LABEL_DIALOG_INPUT_PLACEHOLDER,
    EDIT_LABEL_CANCEL,
    EDIT_LABEL_SUBMIT,
    EDIT_LABEL_DIALOG_TITLE,
    SNACKBAR_ACTION_RETRY,
    SNACKBAR_AUTOHIDE_DISABLED,
    DELETE_LABEL_DIALOG_HELP,
    DELETE_LABEL_CANCEL,
    DELETE_LABEL_SUBMIT,
    DELETE_LABEL_DIALOG_TITLE,
    ADD_ACTIVE_LABEL,
    REMOVE_ACTIVE_LABEL
} from '../../../common/constants';
import { ListItemSecondaryAction } from '@material-ui/core';

class Label extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null
        };

        //Bind functions in constructor so a new function isn't made in every render
        this.handleClick = this.handleClick.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
    }

    handleClick(event) {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleItemClick() {
        this.props.updateActiveLabels(ADD_ACTIVE_LABEL, this.props.label, this.props.query, this.props.activeLabels, this.props.receiptCurrentPage, this.props.csrfHeaderName, this.props.csrfToken);
    }

    handleClose() {
        this.setState({ anchorEl: null });
    };

    handleDeleteClick() {
        let options = {
            dialogText: DELETE_LABEL_DIALOG_HELP + this.props.label.name + "?",
            cancelText: DELETE_LABEL_CANCEL,
            submitText: DELETE_LABEL_SUBMIT
        };

        this.handleClose();
        this.props.openDialog(DELETE_LABEL_DIALOG_TITLE, this.handleDeleteSubmit, this.props.closeDialog, options);
    }

    handleDeleteSubmit() {
        let self = this;
        //Remove from active labels then delete
        this.props.updateActiveLabels(
            REMOVE_ACTIVE_LABEL, 
            this.props.label, 
            this.props.query, 
            this.props.activeLabels, 
            this.props.receiptCurrentPage, 
            this.props.csrfHeaderName, 
            this.props.csrfToken
        ).then(function(resp) {
            self.props.deleteLabel(
                self.props.label.name,
                self.props.csrfHeaderName,
                self.props.csrfToken
            );
        });
    }

    handleEditClick(event, oldCategoryName) {
        let options = {
            dialogText: EDIT_LABEL_DIALOG_HELP + this.props.name,
            textFields: [
                {
                    label: EDIT_LABEL_DIALOG_INPUT_PLACEHOLDER,
                    defaultValue: oldCategoryName ? oldCategoryName : this.props.name
                }
            ],
            cancelText: EDIT_LABEL_CANCEL,
            submitText: EDIT_LABEL_SUBMIT
        };

        this.handleClose();
        this.props.openDialog(EDIT_LABEL_DIALOG_TITLE, this.handleEditSubmit, this.props.closeDialog, options);
    }

    handleEditSubmit({ NewCategoryName }) {
        this.props.editLabel(
            NewCategoryName,
            this.props.label.name,
            [
                SNACKBAR_ACTION_RETRY
            ],
            [
                this.handleEditClick
            ],
            SNACKBAR_AUTOHIDE_DISABLED,
            this.props.csrfHeaderName,
            this.props.csrfToken
        );
    }

    render() {
        const { label, num } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        //TODO: Fix being able to click secondary action while drawer is collapsed
        return (
            <ListItem 
                button
                key={num}
                onClick={this.handleItemClick}
            >
                <ListItemIcon>
                    <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary={label.name} />
                <ListItemSecondaryAction>
                    <IconButton
                        aria-label="Label Options"
                        aria-haspopup="true"
                        onClick={this.handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={this.handleClose}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: 200,
                            },
                        }}
                    >
                        {LABEL_MENU_OPTIONS.map(option => {
                            switch (option) {
                                case LABEL_MENU_DELETE:
                                    return (
                                        <MenuItem key={option} onClick={this.handleDeleteClick}>
                                            {option}
                                        </MenuItem>
                                    );
                                case LABEL_MENU_EDIT:
                                    return (
                                        <MenuItem key={option} onClick={this.handleEditClick}>
                                            {option}
                                        </MenuItem>
                                    );
                            }
                        })}
                    </Menu>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

Label.propTypes = {
    label: PropTypes.object.isRequired,
    num: PropTypes.number.isRequired,
    csrfToken: PropTypes.string.isRequired,
    csrfHeaderName: PropTypes.string.isRequired,
    deleteLabel: PropTypes.func.isRequired,
    editLabel: PropTypes.func.isRequired,
    openDialog: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired,
    updateActiveLabels: PropTypes.func.isRequired
};

export default Label;