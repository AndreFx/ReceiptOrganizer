import React from "react";
import PropTypes from "prop-types";
import update from "react-addons-update";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DIALOG_CANCEL, DIALOG_SUBMIT } from "../../../common/constants";

class DialogWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVals: {}
    };

    this.textFieldRefs = [];
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onEnterPressed = this.onEnterPressed.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleTextFieldRefUpdate = this.handleTextFieldRefUpdate.bind(this);
  }

  handleClose() {
    this.setState({
      inputVals: {}
    });
    this.textFieldRefs = [];
    this.props.dialog.close();
  }

  handleUserInput() {
    const value = event.target.value;
    if (this.state.inputVals[event.target.id]) {
      this.setState({
        inputVals: update(this.state.inputVals, {
          [event.target.id]: {
            $set: value
          }
        })
      });
    } else {
      this.setState({
        inputVals: {
          [event.target.id]: value
        }
      });
    }
  }

  handleTextFieldRefUpdate(ref, index) {
    //ref callback prop gets called when a component is destroyed
    //We remove it from the array to ensure a full reset if this component isn't destroyed
    //between different dialog props
    if (!ref) {
      this.textFieldRefs.filter(function(el, ind) {
        return ind !== index;
      });
    } else {
      this.textFieldRefs[index] = ref;
    }
  }

  onEnterPressed(event) {
    if (event.keyCode == 13 && event.shiftKey == false) {
      event.preventDefault();
      this.handleSubmit();
    }
  }

  handleSubmit() {
    let finalVals = this.state.inputVals;

    //Ensures default values get submitted if not modified
    this.textFieldRefs.forEach(function(el, ind, arr) {
      if (!finalVals[el.props.id]) {
        finalVals[el.props.id] = el.props.defaultValue;
      }
    });
    this.props.dialog.submit(finalVals);
    this.handleClose();
  }

  render() {
    const { isLoading, dialog } = this.props;
    let self = this;
    let mOptions = dialog.options ? dialog.options : {};

    return (
      <Dialog
        open={dialog.open}
        onClose={this.handleClose}
        disableBackdropClick={isLoading}
        disableEscapeKeyDown={isLoading}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title"> {dialog.title} </DialogTitle>
        <DialogContent>
          {mOptions.dialogText && (
            <DialogContentText>{mOptions.dialogText}</DialogContentText>
          )}
          {mOptions.textFields &&
            mOptions.textFields.length != 0 &&
            mOptions.textFields.map(function(el, ind, arr) {
              if (arr.length - 1 == ind) {
                return (
                  <TextField
                    autoFocus
                    margin="dense"
                    key={el.label + ind}
                    id={el.label.replace(/\s/g, "")}
                    label={el.label}
                    type="text"
                    fullWidth
                    onChange={self.handleUserInput}
                    onKeyDown={self.onEnterPressed}
                    disabled={isLoading}
                    defaultValue={el.defaultValue}
                    ref={ref => self.handleTextFieldRefUpdate(ref, ind)}
                  />
                );
              } else {
                return (
                  <TextField
                    autoFocus
                    margin="dense"
                    key={el.label + ind}
                    id={"dialogTextField" + ind}
                    label={el.label}
                    type="text"
                    fullWidth
                    onChange={self.onChange}
                    disabled={isLoading}
                    defaultValue={el.defaultValue}
                    ref={ref => self.handleTextFieldRefUpdate(ref, ind)}
                  />
                );
              }
            })}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleClose}
            color="primary"
            disabled={isLoading}
          >
            {mOptions.cancelText ? mOptions.cancelText : DIALOG_CANCEL}
          </Button>
          <Button
            onClick={this.handleSubmit}
            color="primary"
            disabled={isLoading}
          >
            {mOptions.submitText ? mOptions.submitText : DIALOG_SUBMIT}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DialogWrapper.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  dialog: PropTypes.object.isRequired
};

export default DialogWrapper;
