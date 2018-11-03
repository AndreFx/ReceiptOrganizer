import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = {
  root: {
    flexGrow: 1,
    width: "100%",
    zIndex: 2,
    top: 0,
    left: 0,
    position: "absolute"
  },
  linearProgress: {
    height: "2vh"
  }
};

function LinearIndeterminate(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <LinearProgress classes={classes.height} color="secondary" />
    </div>
  );
}

LinearIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LinearIndeterminate);
