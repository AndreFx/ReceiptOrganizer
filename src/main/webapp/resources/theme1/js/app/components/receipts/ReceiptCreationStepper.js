import React, { Component } from "react";
import PropTypes from "prop-types";
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
  RECEIPT_CREATION_STEP_MODIFY_DATA,
  CURRENCY_FIXED_DECIMAL,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  SUCCESS_SNACKBAR,
  SNACKBAR_AUTOHIDE_DURATION_DEFAULT
} from "../../../common/constants";
import ReceiptCreationUpload from "./ReceiptCreationUpload";
import ReceiptEdit, {
  RECEIPT_DESCRIPTION_NAME,
  RECEIPT_TAX_NAME,
  RECEIPT_TOTAL_NAME,
  RECEIPT_TITLE_NAME,
  RECEIPT_ITEM_NAME_NAME,
  RECEIPT_ITEM_PRICE_NAME,
  RECEIPT_ITEM_QUANTITY_NAME,
  RECEIPT_ITEM_WAR_LEN_NAME
} from "./ReceiptEdit";
import {
  TITLE_TOO_LONG,
  TAX_NOT_A_NUMBER,
  TOTAL_NOT_A_NUMBER,
  DESCRIPTION_TOO_LONG,
  TITLE_REQUIRED,
  NAME_REQUIRED,
  NAME_TOO_LONG,
  QUANTITY_NOT_A_NUMBER,
  PRICE_NOT_A_NUMBER,
  LENGTH_NOT_A_NUMBER,
  RECEIPT_CREATION_SUCCESS
} from "../../../common/uiTextConstants";

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

function getInitialState() {
  return {
    activeStep: 0,
    skipOcr: false,
    fileUpload: null,
    newReceipt: null,
    editFormErrors: {
      title: "",
      tax: "",
      total: "",
      description: "",
      items: []
    },
    editFormValid: {
      title: true,
      tax: true,
      total: true,
      description: true,
      items: []
    }
  };
}

class ReceiptCreationStepper extends Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();

    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.getStepContent = this.getStepContent.bind(this);

    this.handleOCRCheckboxChange = this.handleOCRCheckboxChange.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleItemAdd = this.handleItemAdd.bind(this);
    this.handleItemRemove = this.handleItemRemove.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.validateEditFormField = this.validateEditFormField.bind(this);
    this.validateEditFormItemField = this.validateEditFormItemField.bind(this);
    this.validateEditForm = this.validateEditForm.bind(this);
  }

  handleNext() {
    switch (this.state.activeStep) {
      case 0:
        const self = this;
        this.props
          .uploadReceipt(this.state.skipOcr, this.state.fileUpload)
          .then(function(response) {
            if (response.success) {
              //Setup form validation and format of the receipt
              self.setState(state => ({
                activeStep: state.activeStep + 1,
                newReceipt: {
                  ...response.newReceipt,
                  labels: response.newReceipt.labels
                    ? response.newReceipt.labels
                    : [],
                  items: response.newReceipt.items.map(function(el) {
                    return {
                      ...el,
                      unitPrice: Number.parseFloat(el.unitPrice).toFixed(
                        CURRENCY_FIXED_DECIMAL
                      ),
                      warrantyUnit: el.warrantyUnit ? el.warrantyUnit : "d"
                    };
                  }),
                  total: Number.parseFloat(response.newReceipt.total).toFixed(
                    CURRENCY_FIXED_DECIMAL
                  ),
                  tax: Number.parseFloat(response.newReceipt.tax).toFixed(
                    CURRENCY_FIXED_DECIMAL
                  ),
                  title: response.newReceipt.title
                    ? response.newReceipt.title
                    : "",
                  description: response.newReceipt.description
                    ? response.newReceipt.description
                    : "",
                  date: response.newReceipt.date
                    ? response.newReceipt.date
                    : new Date(),
                  vendor: response.newReceipt.vendor
                    ? response.newReceipt.vendor
                    : ""
                },
                editFormValid: {
                  ...state.editFormValid,
                  title: response.newReceipt.title !== null,
                  items: response.newReceipt.items.map(function(el) {
                    return {
                      name: true,
                      unitPrice: true,
                      quantity: true,
                      warrantyLength: true,
                      warrantyUnit: true
                    };
                  })
                },
                editFormErrors: {
                  ...state.editFormErrors,
                  title:
                    response.newReceipt.title !== null ? "" : TITLE_REQUIRED,
                  items: response.newReceipt.items.map(function(el) {
                    return {
                      name: "",
                      unitPrice: "",
                      quantity: "",
                      warrantyLength: "",
                      warrantyUnit: ""
                    };
                  })
                }
              }));
            }

            self.props.refreshReceipts();
          });
        break;
      case 1:
        if (this.validateEditForm) {
          //Format labels for server instantiation
          let updatedReceipt = Object.assign({}, this.state.newReceipt);
          updatedReceipt.labels = updatedReceipt.labels.map(function(el) {
            return {
              name: el
            };
          });
          const self = this;
          this.props.editReceipt(updatedReceipt).then(function() {
            self.props.refreshReceipts();
            self.setState(prevState => ({
              activeStep: prevState.activeStep + 1
            }));
          });
        }
        break;
      case 2:
        this.props.onClose({
          msg: RECEIPT_CREATION_SUCCESS,
          variant: SUCCESS_SNACKBAR,
          actions: [],
          handlers: [],
          handlerParams: [],
          autohideDuration: SNACKBAR_AUTOHIDE_DURATION_DEFAULT
        });
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
    this.setState(getInitialState());
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
            formErrors={this.state.editFormErrors}
            onItemAdd={this.handleItemAdd}
            onItemRemove={this.handleItemRemove}
            onItemChange={this.handleItemChange}
            onFieldChange={this.handleFieldChange}
            isLoading={this.props.isLoading}
          />
        );
      default:
        return "Unknown error has occurred";
    }
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

  /* Edit form functions */
  handleItemChange(itemNumber) {
    const self = this;
    return function(event) {
      event.persist();
      const formValidation = self.validateEditFormItemField(
        itemNumber,
        event.target.name,
        event.target.value
      );
      self.setState(prevState => ({
        ...prevState,
        newReceipt: {
          ...prevState.newReceipt,
          items: [
            ...prevState.newReceipt.items.map(function(el) {
              if (el.itemNumber === itemNumber) {
                el[event.target.name] = event.target.value;
              }
              return el;
            })
          ]
        },
        ...formValidation
      }));
    };
  }

  handleItemRemove(itemNumber) {
    const self = this;
    return function() {
      self.setState(prevState => ({
        newReceipt: {
          ...prevState.newReceipt,
          items: [
            ...prevState.newReceipt.items
              .filter(function(el) {
                return el.itemNumber !== itemNumber;
              })
              .map(function(el, ind) {
                el.itemNumber = ind;
                return el;
              })
          ]
        },
        editFormValid: {
          ...prevState.editFormValid,
          items: [
            ...prevState.editFormValid.items.filter(function(el, ind) {
              return ind !== el.itemNumber;
            })
          ]
        },
        editFormErrors: {
          ...prevState.editFormErrors,
          items: [
            ...prevState.editFormErrors.items.filter(function(el, ind) {
              return ind !== el.itemNumber;
            })
          ]
        }
      }));
    };
  }

  handleItemAdd() {
    this.setState(prevState => ({
      newReceipt: {
        ...prevState.newReceipt,
        items: [
          ...prevState.newReceipt.items,
          {
            itemNumber: prevState.newReceipt.items.length,
            name: "",
            quantity: 0,
            unitPrice: Number.parseFloat(0).toFixed(CURRENCY_FIXED_DECIMAL),
            warrantyLength: 0,
            warrantyUnit: "d"
          }
        ]
      },
      editFormValid: {
        ...prevState.editFormValid,
        items: [
          ...prevState.editFormValid.items,
          {
            name: false,
            unitPrice: true,
            quantity: true,
            warrantyLength: true,
            warrantyUnit: true
          }
        ]
      },
      editFormErrors: {
        ...prevState.editFormErrors,
        items: [
          ...prevState.editFormErrors.items,
          {
            name: "",
            unitPrice: "",
            quantity: "",
            warrantyLength: "",
            warrantyUnit: ""
          }
        ]
      }
    }));
  }

  handleFieldChange(event) {
    if (event._isAMomentObject) {
      this.setState(prevState => ({
        newReceipt: {
          ...prevState.newReceipt,
          date: event
        }
      }));
    } else {
      event.persist();
      const formValidation = this.validateEditFormField(
        event.target.name,
        event.target.value
      );
      this.setState(prevState => ({
        newReceipt: {
          ...prevState.newReceipt,
          [event.target.name]: event.target.value
        },
        ...formValidation
      }));
    }
  }

  validateEditFormItemField(itemNumber, fieldName, value) {
    let fieldValidationErrors = this.state.editFormErrors;
    let nameValid = this.state.editFormValid.items[itemNumber].name;
    let quantityValid = this.state.editFormValid.items[itemNumber].quantity;
    let unitPriceValid = this.state.editFormValid.items[itemNumber].unitPrice;
    let warrantyLengthValid = this.state.editFormValid.items[itemNumber]
      .warrantyLength;
    let warrantyUnitValid = this.state.editFormValid.items[itemNumber]
      .warrantyUnit;

    switch (fieldName) {
      case RECEIPT_ITEM_NAME_NAME:
        nameValid = value.length > 0 && value.length <= MAX_TITLE_LENGTH;
        if (!nameValid && value.length <= 0) {
          fieldValidationErrors.items[itemNumber].name = nameValid
            ? ""
            : NAME_REQUIRED;
        } else {
          fieldValidationErrors.items[itemNumber].name = nameValid
            ? ""
            : NAME_TOO_LONG;
        }
        break;
      case RECEIPT_ITEM_QUANTITY_NAME:
        quantityValid = !isNaN(value);
        fieldValidationErrors.items[itemNumber].quantity = quantityValid
          ? ""
          : QUANTITY_NOT_A_NUMBER;
        break;
      case RECEIPT_ITEM_PRICE_NAME:
        unitPriceValid = !isNaN(value);
        fieldValidationErrors.items[itemNumber].unitPrice = unitPriceValid
          ? ""
          : PRICE_NOT_A_NUMBER;
        break;
      case RECEIPT_ITEM_WAR_LEN_NAME:
        warrantyLengthValid = !isNaN(value);
        fieldValidationErrors.items[
          itemNumber
        ].warrantyLength = warrantyLengthValid ? "" : LENGTH_NOT_A_NUMBER;
        break;
      default:
        break;
    }

    return {
      editFormErrors: fieldValidationErrors,
      editFormValid: {
        ...this.state.editFormValid,
        items: [
          ...this.state.editFormValid.items.map(function(el, ind) {
            if (ind === itemNumber) {
              el.name = nameValid;
              el.quantity = quantityValid;
              el.unitPrice = unitPriceValid;
              el.warrantyLength = warrantyLengthValid;
              el.warrantyUnit = warrantyUnitValid;
            }
            return el;
          })
        ]
      }
    };
  }

  validateEditFormField(fieldName, value) {
    let fieldValidationErrors = this.state.editFormErrors;
    let titleValid = this.state.editFormValid.title;
    let descriptionValid = this.state.editFormValid.description;
    let taxValid = this.state.editFormValid.tax;
    let totalValid = this.state.editFormValid.total;

    switch (fieldName) {
      case RECEIPT_TITLE_NAME:
        titleValid = value.length > 0 && value.length <= MAX_TITLE_LENGTH;
        if (!titleValid && value.length <= 0) {
          fieldValidationErrors.title = titleValid ? "" : TITLE_REQUIRED;
        } else {
          fieldValidationErrors.title = titleValid ? "" : TITLE_TOO_LONG;
        }
        break;
      case RECEIPT_DESCRIPTION_NAME:
        descriptionValid = value.length <= MAX_DESCRIPTION_LENGTH;
        fieldValidationErrors.description = descriptionValid
          ? ""
          : DESCRIPTION_TOO_LONG;
        break;
      case RECEIPT_TAX_NAME:
        taxValid = !isNaN(value);
        fieldValidationErrors.tax = taxValid ? "" : TAX_NOT_A_NUMBER;
        break;
      case RECEIPT_TOTAL_NAME:
        totalValid = !isNaN(value);
        fieldValidationErrors.total = totalValid ? "" : TOTAL_NOT_A_NUMBER;
        break;
      default:
        break;
    }

    return {
      editFormErrors: fieldValidationErrors,
      editFormValid: {
        ...this.state.editFormValid,
        title: titleValid,
        description: descriptionValid,
        total: totalValid,
        tax: taxValid
      }
    };
  }

  validateEditForm() {
    let isValid = true;
    //Iterate over editFormValid object properties
    Object.keys(this.state.editFormValid).forEach(function(key) {
      if (
        prevState.editFormErrors.hasOwnProperty(key) &&
        key !== "isAllValid"
      ) {
        if (Array.isArray(obj[key])) {
          //Iterate over item array
          obj[key].forEach(function(el) {
            //Iterate over item object properties
            Object.keys(el).forEach(function(arrElKey) {
              if (
                !(
                  el.hasOwnProperty(arrElKey) &&
                  el.name &&
                  el.quantity &&
                  el.unitPrice &&
                  el.warrantyLength &&
                  el.warrantyUnit
                )
              ) {
                isValid = false;
              }
            });
          });
        } else if (!obj[key]) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  render() {
    const { classes, isLoading } = this.props;
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
                    disabled={(activeStep === 0 && !fileUpload) || isLoading}
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
  editReceipt: PropTypes.func.isRequired,
  refreshReceipts: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  labels: PropTypes.array
};

export default withStyles(styles, { withTheme: true })(ReceiptCreationStepper);
