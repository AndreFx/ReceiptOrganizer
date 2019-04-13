import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { CURRENCY_FIXED_DECIMAL } from "../../../common/constants";
import { formatReceipt } from "../../actions/receipts/receiptsActions";

const styles = theme => ({
  fileUploadInput: {
    display: "none"
  },
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  skipOcrCheckbox: {
    marginLeft: 8
  },
  buttonRow: {
    paddingTop: 10
  }
});

class ReceiptUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skipOcr: false,
      fileUpload: null
    };

    this.handleFileInputClick = this.handleFileInputClick.bind(this);
    this.handleOCRCheckboxChange = this.handleOCRCheckboxChange.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.fileInput = React.createRef();
  }

  handleFileInputClick() {
    if (!this.props.isLoading) {
      this.fileInput.current.click();
    }
  }

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

  handleSubmit() {
    const self = this;
    this.props
      .uploadReceipt(this.state.skipOcr, this.state.fileUpload)
      .then(function(response) {
        if (response.success) {
          //Format the receipt
          let newReceipt = formatReceipt(response.newReceipt);

          self.props.refreshReceipts();
          self.props.onSubmit({ newReceipt });
        }
      });
  }

  render() {
    const { classes, isLoading, onCancel } = this.props;
    const { fileUpload, skipOcr } = this.state;

    return (
      <div>
        <FormGroup row>
          <input
            accept="image/*,application/pdf"
            type="file"
            id="receipt-file-upload"
            className={classes.fileUploadInput}
            onChange={this.handleFileInputChange}
            ref={this.fileInput}
            disabled={isLoading}
          />
          <label htmlFor="receipt-file-upload">
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              onClick={this.handleFileInputClick}
              disabled={isLoading}
            >
              {fileUpload && fileUpload.name ? fileUpload.name : "Upload"}
              <CloudUploadIcon className={classes.rightIcon} />
            </Button>
          </label>
          <FormControlLabel
            control={
              <Checkbox
                checked={skipOcr}
                disabled={isLoading}
                onChange={this.handleOCRCheckboxChange}
                value="checkedB"
                color="primary"
              />
            }
            label="Skip OCR"
            className={classes.skipOcrCheckbox}
          />
        </FormGroup>
        <Grid
          className={classes.buttonRow}
          container
          spacing={16}
          alignItems="flex-start"
          justify="flex-start"
          direction="column"
        >
          <Grid item xs={12}>
            <Button
              onClick={onCancel}
              className={classes.button}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              disabled={!fileUpload || isLoading}
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
              className={classes.button}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

ReceiptUpload.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  uploadReceipt: PropTypes.func.isRequired,
  refreshReceipts: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default withStyles(styles, { withTheme: true })(ReceiptUpload);
