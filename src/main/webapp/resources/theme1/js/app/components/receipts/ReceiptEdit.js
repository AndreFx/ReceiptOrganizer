import React, { Component } from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import {
  TextField,
  FormGroup,
  InputAdornment,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Typography,
  Button,
  OutlinedInput,
  IconButton
} from "@material-ui/core";
import { InlineDatePicker } from "material-ui-pickers";
import {
  GET_RECEIPT_FILE_PATH,
  CURRENCY_FIXED_DECIMAL,
  MAX_TITLE_LENGTH,
  MAX_VENDOR_LENGTH,
  MAX_DESCRIPTION_LENGTH
} from "../../../common/constants";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  RECEIPT_TITLE_LABEL,
  REQUIRED_FIELD,
  RECEIPT_DATE_LABEL,
  RECEIPT_TAX_LABEL,
  RECEIPT_TOTAL_LABEL,
  RECEIPT_DESCRIPTION_LABEL,
  RECEIPT_ITEMS,
  RECEIPT_ITEMS_NAME_LABEL,
  RECEIPT_ITEMS_QUANTITY_LABEL,
  RECEIPT_ITEMS_PRICE_LABEL,
  RECEIPT_ITEMS_WARRANTY,
  RECEIPT_ITEMS_WAR_LEN_LABEL,
  RECEIPT_ITEMS_WAR_UNIT_LABEL,
  TITLE_REQUIRED,
  TAX_NOT_A_NUMBER,
  TOTAL_NOT_A_NUMBER,
  TITLE_TOO_LONG,
  LENGTH_NOT_A_NUMBER,
  PRICE_NOT_A_NUMBER,
  QUANTITY_NOT_A_NUMBER,
  NAME_REQUIRED,
  NAME_TOO_LONG,
  RECEIPT_VENDOR_LABEL,
  VENDOR_TOO_LONG,
  DESCRIPTION_TOO_LONG
} from "../../../common/uiTextConstants";

const styles = theme => ({
  container: {
    width: "100%"
  },
  gridItem: {
    margin: theme.spacing.unit * 2,
    padding: "0 !important"
  },
  button: {
    margin: theme.spacing.unit
  },
  typography: {
    marginLeft: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginBottom: 20,
    maxWidth: "100%"
  },
  textFieldMultiple: {
    maxWidth: "100%"
  },
  iconSmall: {
    fontSize: 20
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  chip: {
    margin: theme.spacing.unit / 4
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: "16px 8px 20px",
    maxWidth: "100%"
  },
  image: {
    width: "100%",
    position: "absolute"
  },
  imageGrid: {
    position: "relative",
    overflowY: "scroll",
    overflowX: "hidden"
  }
});

const RECEIPT_DATE_NAME = "date";
const RECEIPT_TITLE_NAME = "title";
const RECEIPT_VENDOR_NAME = "vendor";
const RECEIPT_TAX_NAME = "tax";
const RECEIPT_TOTAL_NAME = "total";
const RECEIPT_DESCRIPTION_NAME = "description";
const RECEIPT_ITEM_NAME_NAME = "name";
const RECEIPT_ITEM_QUANTITY_NAME = "quantity";
const RECEIPT_ITEM_PRICE_NAME = "unitPrice";
const RECEIPT_ITEM_WAR_LEN_NAME = "warrantyLength";
const RECEIPT_ITEM_WAR_UNIT_NAME = "warrantyUnit";

function getWarrantyUnitText(unit) {
  switch (unit) {
    case "d":
      return "Day(s)";
    case "m":
      return "Month(s)";
    case "y":
      return "Year(s)";
    default:
      return "None";
  }
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const WARRANTY_UNITS = ["d", "m", "y"];
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

function getStyles(name, that) {
  return {
    fontWeight:
      that.props.receipt.labels.indexOf(name) === -1
        ? that.props.theme.typography.fontWeightRegular
        : that.props.theme.typography.fontWeightMedium
  };
}

class ReceiptEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemLabelWidth: 0,
      categoryLabelWidth: 0,
      receipt: {
        ...props.receipt,
        labels: props.receipt.labels.map(function(el) {
          return el.name;
        })
      },
      formErrors: {
        title: props.receipt.title !== null ? "" : TITLE_REQUIRED,
        vendor: "",
        tax: "",
        total: "",
        description: "",
        items: props.receipt.items.map(function(el) {
          return {
            name: "",
            unitPrice: "",
            quantity: "",
            warrantyLength: "",
            warrantyUnit: ""
          };
        })
      },
      formValid: {
        title: props.receipt.title !== null,
        vendor: true,
        tax: true,
        total: true,
        description: true,
        items: props.receipt.items.map(function(el) {
          return {
            name: true,
            unitPrice: true,
            quantity: true,
            warrantyLength: true,
            warrantyUnit: true
          };
        })
      }
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleItemAdd = this.handleItemAdd.bind(this);
    this.handleItemRemove = this.handleItemRemove.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.validateEditFormField = this.validateEditFormField.bind(this);
    this.validateEditFormItemField = this.validateEditFormItemField.bind(this);
    this.validateEditForm = this.validateEditForm.bind(this);
  }

  handleItemChange(itemNumber) {
    const self = this;
    return function(event) {
      event.persist();
      const { receipt } = self.state;
      const formValidation = self.validateEditFormItemField(
        itemNumber,
        event.target.name,
        event.target.value
      );
      let items = [...receipt.items];
      items[itemNumber] = Object.assign({}, receipt.items[itemNumber], {
        ...receipt.items[itemNumber],
        [event.target.name]: event.target.value
      });
      self.setState(prevState => ({
        ...prevState,
        receipt: {
          ...prevState.receipt,
          items: items
        },
        ...formValidation
      }));
    };
  }

  handleItemRemove(itemNumber) {
    const self = this;
    return function() {
      self.setState(prevState => ({
        receipt: {
          ...prevState.receipt,
          items: [
            ...prevState.receipt.items
              .filter(function(el) {
                return el.itemNumber !== itemNumber;
              })
              .map(function(el, ind) {
                el.itemNumber = ind;
                return el;
              })
          ]
        },
        formValid: {
          ...prevState.formValid,
          items: [
            ...prevState.formValid.items.filter(function(el, ind) {
              return ind !== el.itemNumber;
            })
          ]
        },
        formErrors: {
          ...prevState.formErrors,
          items: [
            ...prevState.formErrors.items.filter(function(el, ind) {
              return ind !== el.itemNumber;
            })
          ]
        }
      }));
    };
  }

  handleItemAdd() {
    this.setState(prevState => ({
      receipt: {
        ...prevState.receipt,
        items: [
          ...prevState.receipt.items,
          {
            itemNumber: prevState.receipt.items.length,
            name: "",
            quantity: 0,
            unitPrice: Number.parseFloat(0).toFixed(CURRENCY_FIXED_DECIMAL),
            warrantyLength: 0,
            warrantyUnit: "d"
          }
        ]
      },
      formValid: {
        ...prevState.formValid,
        items: [
          ...prevState.formValid.items,
          {
            name: false,
            unitPrice: true,
            quantity: true,
            warrantyLength: true,
            warrantyUnit: true
          }
        ]
      },
      formErrors: {
        ...prevState.formErrors,
        items: [
          ...prevState.formErrors.items,
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
        receipt: {
          ...prevState.receipt,
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
        receipt: {
          ...prevState.receipt,
          [event.target.name]: event.target.value
        },
        ...formValidation
      }));
    }
  }

  validateEditFormItemField(itemNumber, fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let nameValid = this.state.formValid.items[itemNumber].name;
    let quantityValid = this.state.formValid.items[itemNumber].quantity;
    let unitPriceValid = this.state.formValid.items[itemNumber].unitPrice;
    let warrantyLengthValid = this.state.formValid.items[itemNumber]
      .warrantyLength;
    let warrantyUnitValid = this.state.formValid.items[itemNumber].warrantyUnit;

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
      formErrors: fieldValidationErrors,
      formValid: {
        ...this.state.formValid,
        items: [
          ...this.state.formValid.items.map(function(el, ind) {
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
    let fieldValidationErrors = this.state.formErrors;
    let titleValid = this.state.formValid.title;
    let vendorValid = this.state.formValid.vendor;
    let descriptionValid = this.state.formValid.description;
    let taxValid = this.state.formValid.tax;
    let totalValid = this.state.formValid.total;

    switch (fieldName) {
      case RECEIPT_TITLE_NAME:
        titleValid = value.length > 0 && value.length <= MAX_TITLE_LENGTH;
        if (!titleValid && value.length <= 0) {
          fieldValidationErrors.title = titleValid ? "" : TITLE_REQUIRED;
        } else {
          fieldValidationErrors.title = titleValid ? "" : TITLE_TOO_LONG;
        }
        break;
      case RECEIPT_VENDOR_NAME:
        vendorValid = value.length <= MAX_VENDOR_LENGTH;
        fieldValidationErrors.vendor = vendorValid ? "" : VENDOR_TOO_LONG;
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
      formErrors: fieldValidationErrors,
      formValid: {
        ...this.state.formValid,
        title: titleValid,
        description: descriptionValid,
        total: totalValid,
        tax: taxValid
      }
    };
  }

  validateEditForm() {
    let isValid = true;
    //Iterate over formValid object properties
    Object.keys(this.state.formValid).forEach(function(key) {
      if (prevState.formErrors.hasOwnProperty(key) && key !== "isAllValid") {
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

  handleSubmit() {
    if (this.validateEditForm) {
      //Format labels for server instantiation
      let updatedReceipt = Object.assign({}, this.state.receipt);
      updatedReceipt.labels = updatedReceipt.labels.map(function(el) {
        return {
          name: el
        };
      });
      const self = this;
      this.props.editReceipt(updatedReceipt).then(function() {
        self.props.refreshReceipts();
        if (self.props.onSubmit) {
          self.props.onSubmit();
        }
      });
    }
  }

  componentDidUpdate() {
    if (
      !this.state.itemLabelWidth &&
      ReactDOM.findDOMNode(this.ItemInputLabelRef)
    ) {
      this.setState({
        itemLabelWidth: ReactDOM.findDOMNode(this.ItemInputLabelRef).offsetWidth
      });
    }
  }

  componentDidMount() {
    if (ReactDOM.findDOMNode(this.ItemInputLabelRef)) {
      this.setState({
        itemLabelWidth: ReactDOM.findDOMNode(this.ItemInputLabelRef)
          .offsetWidth,
        categoryLabelWidth: ReactDOM.findDOMNode(this.CategoryInputLabelRef)
          .offsetWidth
      });
    } else {
      this.setState({
        itemLabelWidth: undefined,
        categoryLabelWidth: ReactDOM.findDOMNode(this.CategoryInputLabelRef)
          .offsetWidth
      });
    }
  }

  render() {
    const { classes, labels, onCancel, isLoading, allowEdit } = this.props;
    const {
      categoryLabelWidth,
      itemLabelWidth,
      formErrors,
      receipt
    } = this.state;
    const disabled = isLoading || !allowEdit;

    return (
      <div>
        <Grid container spacing={24} justify="center">
          <Grid item xs className={classes.gridItem}>
            <form noValidate autoComplete="off" className={classes.container}>
              <FormGroup>
                <TextField
                  required
                  name={RECEIPT_TITLE_NAME}
                  label={RECEIPT_TITLE_LABEL}
                  placeholder={RECEIPT_TITLE_LABEL}
                  value={receipt.title}
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                  onChange={this.handleFieldChange}
                  helperText={
                    formErrors[RECEIPT_TITLE_NAME]
                      ? formErrors[RECEIPT_TITLE_NAME]
                      : REQUIRED_FIELD
                  }
                  error={formErrors[RECEIPT_TITLE_NAME].length !== 0}
                  disabled={disabled}
                />
              </FormGroup>
              <FormGroup>
                <TextField
                  name={RECEIPT_VENDOR_NAME}
                  label={RECEIPT_VENDOR_LABEL}
                  placeholder={RECEIPT_VENDOR_LABEL}
                  value={receipt.vendor}
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                  onChange={this.handleFieldChange}
                  helperText={
                    formErrors[RECEIPT_VENDOR_NAME]
                      ? formErrors[RECEIPT_VENDOR_NAME]
                      : ""
                  }
                  error={formErrors[RECEIPT_VENDOR_NAME].length !== 0}
                  disabled={disabled}
                />
              </FormGroup>
              <FormGroup>
                <InlineDatePicker
                  variant="outlined"
                  label={RECEIPT_DATE_LABEL}
                  name={RECEIPT_DATE_NAME}
                  value={receipt.date}
                  onChange={this.handleFieldChange}
                  className={classes.textField}
                  disabled={disabled}
                />
              </FormGroup>
              <FormGroup>
                <Typography variant="h6" gutterBottom>
                  {RECEIPT_ITEMS}
                </Typography>
                <Grid container direction="row" justify="space-evenly">
                  <Grid item xs={3}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      className={classes.typography}
                    >
                      {RECEIPT_ITEMS_NAME_LABEL}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      className={classes.typography}
                    >
                      {RECEIPT_ITEMS_QUANTITY_LABEL}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      className={classes.typography}
                    >
                      {RECEIPT_ITEMS_PRICE_LABEL}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      className={classes.typography}
                    >
                      {RECEIPT_ITEMS_WARRANTY}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} />
                </Grid>
              </FormGroup>
              <FormGroup>
                <Grid container>
                  {receipt.items.map(el => {
                    return (
                      <Grid
                        container
                        direction="row"
                        justify="space-evenly"
                        key={el.itemNumber}
                      >
                        <Grid item xs={3}>
                          <TextField
                            required
                            label={RECEIPT_ITEMS_NAME_LABEL}
                            name={RECEIPT_ITEM_NAME_NAME}
                            value={el.name}
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            onChange={this.handleItemChange(el.itemNumber)}
                            helperText={
                              formErrors.items[el.itemNumber][
                                RECEIPT_ITEM_NAME_NAME
                              ]
                                ? formErrors.items[el.itemNumber][
                                    RECEIPT_ITEM_NAME_NAME
                                  ]
                                : ""
                            }
                            error={
                              formErrors.items[el.itemNumber][
                                RECEIPT_ITEM_NAME_NAME
                              ].length !== 0
                            }
                            disabled={disabled}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            required
                            label={RECEIPT_ITEMS_QUANTITY_LABEL}
                            name={RECEIPT_ITEM_QUANTITY_NAME}
                            value={el.quantity}
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            onChange={this.handleItemChange(el.itemNumber)}
                            helperText={
                              formErrors.items[el.itemNumber][
                                RECEIPT_ITEM_QUANTITY_NAME
                              ]
                                ? formErrors.items[el.itemNumber][
                                    RECEIPT_ITEM_QUANTITY_NAME
                                  ]
                                : ""
                            }
                            error={
                              formErrors.items[el.itemNumber][
                                RECEIPT_ITEM_QUANTITY_NAME
                              ].length !== 0
                            }
                            disabled={disabled}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            required
                            label={RECEIPT_ITEMS_PRICE_LABEL}
                            name={RECEIPT_ITEM_PRICE_NAME}
                            value={el.unitPrice}
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              )
                            }}
                            onChange={this.handleItemChange(el.itemNumber)}
                            helperText={
                              formErrors.items[el.itemNumber][
                                RECEIPT_ITEM_PRICE_NAME
                              ]
                                ? formErrors.items[el.itemNumber][
                                    RECEIPT_ITEM_PRICE_NAME
                                  ]
                                : ""
                            }
                            error={
                              formErrors.items[el.itemNumber][
                                RECEIPT_ITEM_PRICE_NAME
                              ].length !== 0
                            }
                            disabled={disabled}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Grid container direction="row">
                            <Grid item xs={6}>
                              <TextField
                                required
                                label={RECEIPT_ITEMS_WAR_LEN_LABEL}
                                name={RECEIPT_ITEM_WAR_LEN_NAME}
                                value={el.warrantyLength}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                onChange={this.handleItemChange(el.itemNumber)}
                                helperText={
                                  formErrors.items[el.itemNumber][
                                    RECEIPT_ITEM_WAR_LEN_NAME
                                  ]
                                    ? formErrors.items[el.itemNumber][
                                        RECEIPT_ITEM_WAR_LEN_NAME
                                      ]
                                    : ""
                                }
                                error={
                                  formErrors.items[el.itemNumber][
                                    RECEIPT_ITEM_WAR_LEN_NAME
                                  ].length !== 0
                                }
                                disabled={disabled}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl
                                className={classes.formControl}
                                variant="outlined"
                              >
                                <InputLabel
                                  ref={ref => (this.ItemInputLabelRef = ref)}
                                  htmlFor={
                                    "item-war-unit-select-" + el.itemNumber
                                  }
                                >
                                  {RECEIPT_ITEMS_WAR_UNIT_LABEL}
                                </InputLabel>
                                <Select
                                  value={el.warrantyUnit}
                                  onChange={this.handleItemChange(
                                    el.itemNumber
                                  )}
                                  input={
                                    <OutlinedInput
                                      id={
                                        "item-war-unit-select-" + el.itemNumber
                                      }
                                      name={RECEIPT_ITEM_WAR_UNIT_NAME}
                                      labelWidth={itemLabelWidth}
                                    />
                                  }
                                  MenuProps={MenuProps}
                                  disabled={disabled}
                                >
                                  {WARRANTY_UNITS.map(function(val) {
                                    let text = getWarrantyUnitText(val);
                                    return (
                                      <MenuItem key={val} value={val}>
                                        {text}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton
                            className={classNames(
                              classes.button,
                              classes.formControl
                            )}
                            aria-label="Delete"
                            onClick={this.handleItemRemove(el.itemNumber)}
                            disabled={disabled}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    );
                  })}
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      className={classes.button}
                      onClick={this.handleItemAdd}
                      disabled={disabled}
                    >
                      <AddIcon className={classes.leftIcon} />
                      Add Item
                    </Button>
                  </Grid>
                </Grid>
              </FormGroup>
              <FormGroup>
                <TextField
                  required
                  name={RECEIPT_TAX_NAME}
                  label={RECEIPT_TAX_LABEL}
                  placeholder={RECEIPT_TAX_LABEL}
                  value={receipt.tax}
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  onChange={this.handleFieldChange}
                  helperText={
                    formErrors[RECEIPT_TAX_NAME]
                      ? formErrors[RECEIPT_TAX_NAME]
                      : REQUIRED_FIELD
                  }
                  error={formErrors[RECEIPT_TAX_NAME].length !== 0}
                  disabled={disabled}
                />
              </FormGroup>
              <FormGroup>
                <TextField
                  required
                  name={RECEIPT_TOTAL_NAME}
                  label={RECEIPT_TOTAL_LABEL}
                  placeholder={RECEIPT_TOTAL_LABEL}
                  value={receipt.total}
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  onChange={this.handleFieldChange}
                  helperText={
                    formErrors[RECEIPT_TOTAL_NAME]
                      ? formErrors[RECEIPT_TOTAL_NAME]
                      : REQUIRED_FIELD
                  }
                  error={formErrors[RECEIPT_TOTAL_NAME].length !== 0}
                  disabled={disabled}
                />
              </FormGroup>
              <FormGroup>
                <FormControl className={classes.formControl} variant="outlined">
                  <InputLabel
                    ref={ref => (this.CategoryInputLabelRef = ref)}
                    htmlFor="select-categories"
                  >
                    Categories
                  </InputLabel>
                  <Select
                    multiple
                    value={receipt.labels}
                    onChange={this.handleFieldChange}
                    input={
                      <OutlinedInput
                        id="select-categories"
                        name="labels"
                        labelWidth={categoryLabelWidth}
                      />
                    }
                    renderValue={selected => (
                      <div className={classes.chips}>
                        {selected.map(function(val) {
                          return (
                            <Chip
                              key={val}
                              label={val}
                              className={classes.chip}
                            />
                          );
                        })}
                      </div>
                    )}
                    MenuProps={MenuProps}
                    disabled={disabled}
                  >
                    {labels.map(val => (
                      <MenuItem
                        key={val.name}
                        value={val.name}
                        style={getStyles(val.name, this)}
                      >
                        {val.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormGroup>
              <FormGroup>
                <TextField
                  name={RECEIPT_DESCRIPTION_NAME}
                  label={RECEIPT_DESCRIPTION_LABEL}
                  multiline
                  rowsMax="8"
                  value={receipt.description}
                  className={classNames(
                    classes.textField,
                    classes.textFieldMultiple
                  )}
                  margin="normal"
                  variant="outlined"
                  onChange={this.handleFieldChange}
                  helperText={
                    formErrors[RECEIPT_DESCRIPTION_NAME]
                      ? formErrors[RECEIPT_DESCRIPTION_NAME]
                      : ""
                  }
                  error={formErrors[RECEIPT_DESCRIPTION_NAME].length !== 0}
                  disabled={disabled}
                />
              </FormGroup>
            </form>
          </Grid>
          <Grid
            item
            xs={6}
            className={classNames(classes.imageGrid, classes.gridItem)}
          >
            <img
              src={GET_RECEIPT_FILE_PATH.format(receipt.id, receipt.fileName)}
              className={classes.image}
            />
          </Grid>
        </Grid>
        <Grid
          className={classes.stepperButtonRow}
          container
          spacing={16}
          alignItems="flex-start"
          justify="flex-start"
          direction="column"
        >
          <Grid item xs={12}>
            {onCancel && (
              <Button
                onClick={onCancel}
                className={classes.button}
                disabled={disabled}
              >
                Cancel
              </Button>
            )}
            <Button
              disabled={disabled}
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
              className={classes.button}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

ReceiptEdit.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  editReceipt: PropTypes.func.isRequired,
  refreshReceipts: PropTypes.func.isRequired,
  receipt: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  allowEdit: PropTypes.bool.isRequired
};

export default withStyles(styles, { withTheme: true })(ReceiptEdit);
