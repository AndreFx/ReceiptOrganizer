import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

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
  }
});

class ReceiptCreationUpload extends Component {
  constructor(props) {
    super(props);

    this.handleFileInputClick = this.handleFileInputClick.bind(this);

    this.fileInput = React.createRef();
  }

  handleFileInputClick() {
    if (!this.props.isLoading) {
      this.fileInput.current.click();
    }
  }

  render() {
    const {
      classes,
      theme,
      handleFileInputChange,
      fileName,
      handleOcrCheckboxChange,
      skipOcr,
      isLoading
    } = this.props;

    return (
      <FormGroup row>
        <input
          accept="image/*,application/pdf"
          type="file"
          id="receipt-file-upload"
          className={classes.fileUploadInput}
          onChange={handleFileInputChange}
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
            {fileName ? fileName : "Upload"}
            <CloudUploadIcon className={classes.rightIcon} />
          </Button>
        </label>
        <FormControlLabel
          control={
            <Checkbox
              checked={skipOcr}
              disabled={isLoading}
              onChange={handleOcrCheckboxChange}
              value="checkedB"
              color="primary"
            />
          }
          label="Skip OCR"
          className={classes.skipOcrCheckbox}
        />
      </FormGroup>
    );
  }
}

ReceiptCreationUpload.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  handleFileInputChange: PropTypes.func.isRequired,
  handleOcrCheckboxChange: PropTypes.func.isRequired,
  skipOcr: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  fileName: PropTypes.string
};

export default withStyles(styles, { withTheme: true })(ReceiptCreationUpload);
