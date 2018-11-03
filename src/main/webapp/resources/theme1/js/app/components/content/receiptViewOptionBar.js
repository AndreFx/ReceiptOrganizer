import React from "react";
import PropTypes from "prop-types";
import ReceiptIcon from "@material-ui/icons/Receipt";
import Chip from "@material-ui/core/Chip";
import { withStyles } from "@material-ui/core";
import { REMOVE_ACTIVE_LABEL } from "../../../common/constants";

//Custom Imports

const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    padding: theme.spacing.unit / 2
  },
  chip: {
    margin: theme.spacing.unit / 2
  }
});

class ReceiptViewOptionBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleChipDelete = this.handleChipDelete.bind(this);
  }

  handleChipDelete(label) {
    this.props.updateActiveLabels(
      REMOVE_ACTIVE_LABEL,
      label,
      null,
      this.props.query,
      this.props.activeLabels,
      this.props.currentReceiptPage,
      this.props.csrfHeaderName,
      this.props.csrfToken
    );
  }

  render() {
    const { activeLabels, query, currentReceiptPage, classes } = this.props;

    return (
      <div className={classes.root}>
        {activeLabels.map((l, ind) => (
          <Chip
            key={l.name}
            color="primary"
            label={l.name}
            onDelete={e => this.handleChipDelete(l)}
            icon={<ReceiptIcon />}
            variant="outlined"
            className={classes.chip}
          />
        ))}
      </div>
    );
  }
}

ReceiptViewOptionBar.propTypes = {
  activeLabels: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  classes: PropTypes.object.isRequired,
  csrfHeaderName: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
  updateActiveLabels: PropTypes.func.isRequired,
  query: PropTypes.string,
  currentReceiptPage: PropTypes.number
};

export default withStyles(styles)(ReceiptViewOptionBar);
