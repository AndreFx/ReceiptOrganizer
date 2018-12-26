import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { ACTION_DRAWER_WIDTH } from "../../../common/constants";
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const styles = theme => ({
  actionDrawerPaper: {
    width: ACTION_DRAWER_WIDTH,
    backgroundColor: "#fafafa"
  },
  drawerPaper: {
    whiteSpace: "nowrap",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 16
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  actionDrawerContent: {
    padding: "5px 25px 30px"
  }
});

class ActionDrawer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      classes,
      open,
      onClose,
      title,
      contentComponent,
      isLoading
    } = this.props;

    return (
      <Drawer
        variant="temporary"
        anchor="right"
        open={open}
        onClose={onClose}
        classes={{
          paper: classNames(
            classes.drawerPaper,
            classes.actionDrawerPaper,
            !open && classes.drawerPaperClose
          )
        }}
        disableBackdropClick={true}
      >
        <div>
          <AppBar position="static" color="default">
            <Toolbar>
              <IconButton
                disabled={isLoading}
                color="inherit"
                aria-label="Close drawer"
                onClick={onClose}
                className={classes.menuButton}
              >
                <CloseIcon />
              </IconButton>
              <Typography
                className={classes.title}
                variant="h6"
                color="inherit"
                noWrap
              >
                {title}
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        <div className={classes.actionDrawerContent}>{contentComponent}</div>
      </Drawer>
    );
  }
}

ActionDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  contentComponent: PropTypes.element.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default withStyles(styles, {
  withTheme: true
})(ActionDrawer);
