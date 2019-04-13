import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import {
  ACTION_DRAWER_WIDTH,
  RECEIPT_CREATION,
  RECEIPT_EDIT,
  RECEIPT_CREATION_TITLE,
  RECEIPT_VIEW
} from "../../../common/constants";
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ReceiptEditContainer from "../../containers/receipts/ReceiptEditContainer";
import ReceiptCreationStepperContainer from "../../containers/receipts/ReceiptCreationStepperContainer";
import { RECEIPT_EDIT_TITLE } from "../../../common/uiTextConstants";

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

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.toggleActionDrawer(false);
  }

  render() {
    const { classes, open, view, options, isReceiptsLoading } = this.props;
    let component = null;
    let isLoading = null;
    let title = "";

    switch (view) {
      case RECEIPT_CREATION:
        component = (
          <ReceiptCreationStepperContainer onClose={this.handleClose} />
        );
        isLoading = isReceiptsLoading;
        title = RECEIPT_CREATION_TITLE;
        break;
      case RECEIPT_EDIT:
        component = (
          <ReceiptEditContainer
            receipt={options.receipt}
            onCancel={this.handleClose}
            allowEdit={true}
          />
        );
        isLoading = isReceiptsLoading;
        title = RECEIPT_EDIT_TITLE + options.receipt.title;
        break;
      case RECEIPT_VIEW:
        component = (
          <ReceiptEditContainer
            receipt={options.receipt}
            onSubmit={this.handleClose}
            onCancel={this.handleClose}
            allowEdit={false}
          />
        );
        isLoading = isReceiptsLoading;
        title = options.receipt.title;
        break;
      default:
        break;
    }

    return (
      <Drawer
        variant="temporary"
        anchor="right"
        open={open}
        onClose={this.handleClose}
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
                onClick={this.handleClose}
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
        <div className={classes.actionDrawerContent}>{component}</div>
      </Drawer>
    );
  }
}

ActionDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  toggleActionDrawer: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  view: PropTypes.string.isRequired,
  options: PropTypes.object,
  isLabelsLoading: PropTypes.bool.isRequired,
  isUserLoading: PropTypes.bool.isRequired,
  isReceiptsLoading: PropTypes.bool.isRequired
};

export default withStyles(styles, {
  withTheme: true
})(ActionDrawer);
