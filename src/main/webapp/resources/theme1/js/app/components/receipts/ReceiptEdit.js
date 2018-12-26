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
import { GET_RECEIPT_FILE_PATH } from "../../../common/constants";
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
  RECEIPT_ITEMS_WAR_UNIT_LABEL
} from "../../../common/uiTextConstants";

const styles = theme => ({
  container: {
    width: "100%"
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

export const RECEIPT_DATE_NAME = "date";
export const RECEIPT_TITLE_NAME = "title";
export const RECEIPT_TAX_NAME = "tax";
export const RECEIPT_TOTAL_NAME = "total";
export const RECEIPT_DESCRIPTION_NAME = "description";
export const RECEIPT_ITEM_NAME_NAME = "name";
export const RECEIPT_ITEM_QUANTITY_NAME = "quantity";
export const RECEIPT_ITEM_PRICE_NAME = "unitPrice";
export const RECEIPT_ITEM_WAR_LEN_NAME = "warrantyLength";
export const RECEIPT_ITEM_WAR_UNIT_NAME = "warrantyUnit";

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

class ReceiptEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemLabelWidth: 0,
      categoryLabelWidth: 0
    };

    this.getStyles = this.getStyles.bind(this);
  }

  getStyles(name) {
    return {
      fontWeight:
        this.props.receipt.labels.indexOf(name) === -1
          ? this.props.theme.typography.fontWeightRegular
          : this.props.theme.typography.fontWeightMedium
    };
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
    const {
      classes,
      theme,
      onItemAdd,
      onItemRemove,
      onItemChange,
      onFieldChange,
      receipt,
      labels,
      formErrors,
      isLoading
    } = this.props;
    const { categoryLabelWidth, itemLabelWidth } = this.state;

    //TODO: Add vendor to form
    return (
      <Grid container spacing={24} justify="center">
        <Grid item xs>
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
                onChange={onFieldChange}
                helperText={
                  formErrors[RECEIPT_TITLE_NAME]
                    ? formErrors[RECEIPT_TITLE_NAME]
                    : REQUIRED_FIELD
                }
                error={formErrors[RECEIPT_TITLE_NAME].length !== 0}
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup>
              <InlineDatePicker
                variant="outlined"
                label={RECEIPT_DATE_LABEL}
                name={RECEIPT_DATE_NAME}
                value={receipt.date}
                onChange={onFieldChange}
                className={classes.textField}
                disabled={isLoading}
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
                          onChange={onItemChange(el.itemNumber)}
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
                          disabled={isLoading}
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
                          onChange={onItemChange(el.itemNumber)}
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
                          disabled={isLoading}
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
                          onChange={onItemChange(el.itemNumber)}
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
                          disabled={isLoading}
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
                              onChange={onItemChange(el.itemNumber)}
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
                              disabled={isLoading}
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
                                onChange={onItemChange(el.itemNumber)}
                                input={
                                  <OutlinedInput
                                    id={"item-war-unit-select-" + el.itemNumber}
                                    name={RECEIPT_ITEM_WAR_UNIT_NAME}
                                    labelWidth={itemLabelWidth}
                                  />
                                }
                                MenuProps={MenuProps}
                                disabled={isLoading}
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
                          onClick={onItemRemove(el.itemNumber)}
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
                    onClick={onItemAdd}
                    disabled={isLoading}
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
                onChange={onFieldChange}
                helperText={
                  formErrors[RECEIPT_TAX_NAME]
                    ? formErrors[RECEIPT_TAX_NAME]
                    : REQUIRED_FIELD
                }
                error={formErrors[RECEIPT_TAX_NAME].length !== 0}
                disabled={isLoading}
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
                onChange={onFieldChange}
                helperText={
                  formErrors[RECEIPT_TOTAL_NAME]
                    ? formErrors[RECEIPT_TOTAL_NAME]
                    : REQUIRED_FIELD
                }
                error={formErrors[RECEIPT_TOTAL_NAME].length !== 0}
                disabled={isLoading}
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
                  onChange={onFieldChange}
                  input={
                    <OutlinedInput
                      id="select-categories"
                      name="labels"
                      labelWidth={categoryLabelWidth}
                    />
                  }
                  renderValue={selected => (
                    <div className={classes.chips}>
                      {selected.map(val => (
                        <Chip key={val} label={val} className={classes.chip} />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                  disabled={isLoading}
                >
                  {labels.map(val => (
                    <MenuItem
                      key={val.name}
                      value={val.name}
                      style={this.getStyles(val.name, this)}
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
                onChange={onFieldChange}
                helperText={
                  formErrors[RECEIPT_DESCRIPTION_NAME]
                    ? formErrors[RECEIPT_DESCRIPTION_NAME]
                    : ""
                }
                error={formErrors[RECEIPT_DESCRIPTION_NAME].length !== 0}
                disabled={isLoading}
              />
            </FormGroup>
          </form>
        </Grid>
        <Grid item xs={6} className={classes.imageGrid}>
          <img
            src={GET_RECEIPT_FILE_PATH.format(receipt.id, receipt.fileName)}
            className={classes.image}
          />
        </Grid>
      </Grid>
    );
  }
}

ReceiptEdit.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  onItemAdd: PropTypes.func.isRequired,
  onItemRemove: PropTypes.func.isRequired,
  onItemChange: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  receipt: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired,
  formErrors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default withStyles(styles, { withTheme: true })(ReceiptEdit);
