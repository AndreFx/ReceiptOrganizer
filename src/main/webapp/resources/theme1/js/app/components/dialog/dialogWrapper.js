import React from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DIALOG_CANCEL, DIALOG_SUBMIT } from '../../../common/constants';

class DialogWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputVals: {},
            lastTitle : null,
            lastOptions: {}
        }

        this.textFieldRefs = [];
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onEnterPressed = this.onEnterPressed.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
    };

    handleClose() {
        this.setState({
            inputVals: {}
        });
        this.textFieldRefs = [];
        this.props.close();
    };

    handleUserInput() {
        const value = event.target.value;
        if (this.state.inputVals[event.target.id]) {
            this.setState({
                inputVals: update(this.state.inputVals, { [event.target.id]: { $set: value }})
            });
        } else {
            this.setState({
                inputVals: {
                    [event.target.id]: value
                }
            });
        }
        
    }

    onEnterPressed(event) {
        if (event.keyCode == 13 && event.shiftKey == false) {
            this.handleSubmit();
        }
    }

    handleSubmit() {
        let self = this;
        let finalVals = this.state.inputVals;

        //Ensures default values get submitted if not modified
        this.textFieldRefs.forEach(function(el, ind, arr) {
            if (!finalVals[el.props.id]) {
                finalVals[el.props.id] = el.props.defaultValue;
            }
        });
        this.props.submit(finalVals);
        this.handleClose();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.title && this.props.title != this.state.lastTitle) {
            //Keep last snackbar so we don't lose it while closing a snackbar
            this.setState({
                lastTitle: this.props.title,
                lastOptions: this.props.options
            });
        }
    }

    render() {
        const { isLoading, open, title, options } = this.props;

        let self = this;
        let savedTitle = title;
        let savedOptions = options;

        //Keeps last snackbar information for the duration of it closing
        //This keeps the ui from removing actions, messages, variants, etc while closing a snackbar
        if (!title && this.state.lastOptions) {
            savedTitle = this.state.lastTitle,
            savedOptions = this.state.lastOptions
        }

        return (
            <Dialog
                open={open}
                onClose={this.handleClose}
                disableBackdropClick={isLoading}
                disableEscapeKeyDown={isLoading}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">{savedTitle}</DialogTitle>
                { savedOptions.dialogText || (savedOptions.textFields && savedOptions.textFields.length != 0) ? 
                    <DialogContent>
                        {savedOptions.dialogText ? <DialogContentText>{savedOptions.dialogText}</DialogContentText> : null}
                        {
                            savedOptions.textFields ?
                            savedOptions.textFields.map(function(el, ind, arr) {
                                if (arr.length - 1 == ind) {
                                    return (
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            key={ind}
                                            id={el.label.replace(/\s/g,'')}
                                            label={el.label}
                                            type="text"
                                            fullWidth
                                            onChange={self.handleUserInput} 
                                            onKeyDown={self.onEnterPressed}
                                            disabled={isLoading}
                                            defaultValue={el.defaultValue}
                                            ref={ref => self.textFieldRefs[ind] = ref}
                                        />
                                    );
                                } else {
                                    return (
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            key={ind}
                                            id={"dialogTextField" + ind}
                                            label={el.label}
                                            type="text"
                                            fullWidth
                                            onChange={self.onChange} 
                                            disabled={isLoading}
                                            defaultValue={el.defaultValue}
                                            ref={ref => self.textFieldRefs[ind] = ref}
                                        />
                                    );
                                }
                            })
                            :
                            null
                        }
                    </DialogContent>
                    :
                    null
                }
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary" disabled={isLoading}>
                        {savedOptions.cancelText ? savedOptions.cancelText : DIALOG_CANCEL}
                    </Button>
                    <Button onClick={this.handleSubmit} color="primary" disabled={isLoading}>
                        {savedOptions.submitText ? savedOptions.submitText : DIALOG_SUBMIT}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

DialogWrapper.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired
};

export default DialogWrapper;