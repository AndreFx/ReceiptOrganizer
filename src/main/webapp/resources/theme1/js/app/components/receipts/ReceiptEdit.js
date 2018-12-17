import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import {
  TextField,
  FormGroup,
  InputAdornment,
  Chip,
  MenuItem,
  Input,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Typography
} from "@material-ui/core";
import { InlineDatePicker } from "material-ui-pickers";
import {
  CURRENCY_FIXED_DECIMAL,
  GET_RECEIPT_FILE_PATH
} from "../../../common/constants";
import { relative } from "path";

const styles = theme => ({
  container: {
    width: "100%"
  },
  button: {
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "60%",
    marginBottom: 20
  },
  textFieldMultiple: {
    width: "100%"
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
    margin: theme.spacing.unit,
    width: "100%"
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

function getStyles(name, that) {
  return {
    fontWeight:
      that.state.categories.indexOf(name) === -1
        ? that.props.theme.typography.fontWeightRegular
        : that.props.theme.typography.fontWeightMedium
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
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
      title: "",
      date: null,
      categories: []
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCategorySelected = this.handleCategorySelected.bind(this);
  }

  handleDateChange(selectedDate) {
    this.setState({
      date: selectedDate
    });
  }

  handleCategorySelected(event) {
    this.setState({
      categories: event.target.value
    });
  }

  render() {
    const { classes, theme, receipt, labels } = this.props;

    return (
      <Grid container spacing={24} justify="center">
        <Grid item xs>
          <form noValidate autoComplete="off" className={classes.container}>
            <FormGroup>
              <TextField
                required
                id="title"
                label="Title"
                placeholder="Title"
                value={receipt.title}
                className={classes.textField}
                margin="normal"
                variant="outlined"
              />
            </FormGroup>
            <FormGroup>
              <InlineDatePicker
                variant="outlined"
                label="Date"
                value={receipt.date}
                onChange={this.handleDateChange}
                className={classes.textField}
              />
            </FormGroup>
            <FormGroup>
              <Grid container direction="row" justify="space-evenly">
                <Grid item xs={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Receipt Items
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Name
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Quantity
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Unit Price
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Warranty Length
                  </Typography>
                </Grid>
              </Grid>
            </FormGroup>
            <FormGroup>
              <Grid container />
            </FormGroup>
            <FormGroup>
              <TextField
                required
                id="tax"
                label="Tax"
                placeholder="Tax"
                value={Number.parseFloat(receipt.tax).toFixed(
                  CURRENCY_FIXED_DECIMAL
                )}
                className={classes.textField}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  )
                }}
              />
            </FormGroup>
            <FormGroup>
              <TextField
                required
                id="total"
                label="Total"
                placeholder="Total"
                value={Number.parseFloat(receipt.total).toFixed(
                  CURRENCY_FIXED_DECIMAL
                )}
                className={classes.textField}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  )
                }}
              />
            </FormGroup>
            <FormGroup>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="select-categories">Categories</InputLabel>
                <Select
                  multiple
                  value={this.state.categories}
                  onChange={this.handleCategorySelected}
                  input={<Input id="select-categories" />}
                  renderValue={selected => (
                    <div className={classes.chips}>
                      {selected.map(val => (
                        <Chip key={val} label={val} className={classes.chip} />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
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
                id="description"
                label="Description"
                multiline
                rowsMax="8"
                value={receipt.description}
                onChange={this.handleChange}
                className={classNames(
                  classes.textField,
                  classes.textFieldMultiple
                )}
                margin="normal"
                helperText="Autopopulated with receipt text"
                variant="outlined"
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
  receipt: PropTypes.object.isRequired,
  labels: PropTypes.array
};

export default withStyles(styles, { withTheme: true })(ReceiptEdit);
