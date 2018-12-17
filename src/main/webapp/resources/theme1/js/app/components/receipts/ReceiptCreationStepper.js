import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Button,
  Grid,
  StepLabel,
  Step,
  Stepper
} from "@material-ui/core";

import {
  RECEIPT_CREATION_STEP_UPLOAD,
  RECEIPT_CREATION_STEP_MODIFY_DATA
} from "../../../common/constants";
import ReceiptCreationUpload from "./ReceiptCreationUpload";
import ReceiptEdit from "./ReceiptEdit";

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
  },
  stepperButtonRow: {
    paddingTop: 10
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
      skipOcr: false,
      fileUpload: null,
      newReceipt: null
    };

    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.getStepContent = this.getStepContent.bind(this);

    this.handleOCRCheckboxChange = this.handleOCRCheckboxChange.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
  }

  /* Upload form functions */
  handleOCRCheckboxChange(event) {
    this.setState({
      skipOcr: event.target.checked
    });
  }

  handleFileInputChange(event) {
    this.setState({
      fileUpload: event.target.files[0]
    });
  }

  handleNext() {
    switch (this.state.activeStep) {
      case 0:
        let self = this;
        this.props
          .uploadReceipt(this.state.skipOcr, this.state.fileUpload)
          .then(function(response) {
            if (response.success) {
              self.setState(state => ({
                activeStep: state.activeStep + 1,
                newReceipt: response.newReceipt
              }));
            }
            //TODO: make request to load current query/page num again
          })
          .catch(function() {
            //TODO: Form errors
          });
        break;
      case 1:
        //TODO: Handle edit form here
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
      activeStep: 0
    });
  }

  getStepContent() {
    switch (this.state.activeStep) {
      case 0:
        return (
          <ReceiptCreationUpload
            handleFileInputChange={this.handleFileInputChange}
            handleOcrCheckboxChange={this.handleOCRCheckboxChange}
            skipOcr={this.state.skipOcr}
            fileName={
              this.state.fileUpload && this.state.fileUpload.name
                ? this.state.fileUpload.name
                : null
            }
            isLoading={this.props.isLoading}
          />
        );
      case 1:
        return (
          <ReceiptEdit
            receipt={this.state.newReceipt}
            labels={this.props.labels}
          />
        );
      default:
        return "Unknown error has occurred";
    }
  }

  render() {
    const { classes, theme, isLoading } = this.props;
    const { activeStep, fileUpload } = this.state;
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
            </div>
          ) : (
            <div>
              {this.getStepContent()}
              <Grid
                className={classes.stepperButtonRow}
                container
                spacing={16}
                alignItems="flex-start"
                justify="flex-start"
                direction="column"
              >
                <Grid item xs={12}>
                  {activeStep === 0 ? (
                    <Button
                      onClick={this.handleBack}
                      className={classes.button}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  ) : null}
                  <Button
                    disabled={
                      (activeStep === 0 && !fileUpload) ||
                      (activeStep === 0 && isLoading)
                    }
                    variant="contained"
                    color="primary"
                    onClick={this.handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? "Save" : "Next"}
                  </Button>
                </Grid>
              </Grid>
            </div>
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
  uploadReceipt: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  labels: PropTypes.array
};

export default withStyles(styles, { withTheme: true })(ReceiptCreationStepper);
