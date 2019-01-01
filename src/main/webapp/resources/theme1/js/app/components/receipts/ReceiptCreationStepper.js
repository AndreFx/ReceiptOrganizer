import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Button,
  StepLabel,
  Step,
  Stepper
} from "@material-ui/core";
import {
  RECEIPT_CREATION_STEP_UPLOAD,
  RECEIPT_CREATION_STEP_MODIFY_DATA,
  SUCCESS_SNACKBAR,
  SNACKBAR_AUTOHIDE_DURATION_DEFAULT
} from "../../../common/constants";
import { RECEIPT_CREATION_SUCCESS } from "../../../common/uiTextConstants";
import ReceiptEditContainer from "../../containers/receipts/ReceiptEditContainer";
import ReceiptUploadContainer from "../../containers/receipts/ReceiptUploadContainer";

const styles = theme => ({
  root: {
    width: "100%"
  },
  button: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  stepper: {
    backgroundColor: "#fafafa"
  }
});

function getSteps() {
  return [RECEIPT_CREATION_STEP_UPLOAD, RECEIPT_CREATION_STEP_MODIFY_DATA];
}

class ReceiptCreationStepper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      newReceipt: null
    };

    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.getStepContent = this.getStepContent.bind(this);
  }

  handleNext(options) {
    switch (this.state.activeStep) {
      case 0:
        const { newReceipt } = options;
        this.setState(prevState => ({
          activeStep: prevState.activeStep + 1,
          newReceipt: newReceipt
        }));
        break;
      case 1:
        this.setState(prevState => ({
          activeStep: prevState.activeStep + 1
        }));
        break;
      case 2:
        this.props.addSnackbar({
          msg: RECEIPT_CREATION_SUCCESS,
          variant: SUCCESS_SNACKBAR,
          actions: [],
          handlers: [],
          handlerParams: [],
          autohideDuration: SNACKBAR_AUTOHIDE_DURATION_DEFAULT
        });
        this.props.onClose();
        break;
      default:
        break;
    }
  }

  handleBack() {
    if (this.state.activeStep === 0) {
      this.props.onClose();
    } else {
      this.setState(state => ({
        activeStep: state.activeStep - 1
      }));
    }
  }

  handleReset() {
    this.setState({
      activeStep: 0,
      newReceipt: null
    });
  }

  getStepContent() {
    switch (this.state.activeStep) {
      case 0:
        return (
          <ReceiptUploadContainer
            onSubmit={this.handleNext}
            onCancel={this.handleBack}
          />
        );
      case 1:
        return (
          <ReceiptEditContainer
            onSubmit={this.handleNext}
            receipt={this.state.newReceipt}
            allowEdit={true}
          />
        );
      default:
        return "Unknown error has occurred";
    }
  }

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;
    const steps = getSteps();

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography className={classes.instructions}>
                Receipt saved - Click reset to add another or return to your
                library
              </Typography>
              <Button onClick={this.handleReset} className={classes.button}>
                Reset
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleNext}
                className={classes.button}
              >
                Close
              </Button>
            </div>
          ) : (
            this.getStepContent()
          )}
        </div>
      </div>
    );
  }
}

ReceiptCreationStepper.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  addSnackbar: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default withStyles(styles, { withTheme: true })(ReceiptCreationStepper);
