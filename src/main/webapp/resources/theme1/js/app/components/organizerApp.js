import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Snackbar from "@material-ui/core/Snackbar";
import EditIcon from "@material-ui/icons/Edit";

//Custom imports
import {
  DRAWER_WIDTH,
  SNACKBAR_VERTICAL,
  SNACKBAR_HORIZONTAL,
  SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
  SNACKBAR_EXPAND_QUERY_WIDTH
} from "../../common/constants";
import LinearIndeterminate from "./loading/linearIndeterminate";
import NavContainer from "../containers/navigation/NavContainer";
import SnackbarContentWrapper from "./snackbar/SnackbarContentWrapper";
import ContentWrapperContainer from "../containers/content/ContentWrapperContainer";
import DrawerContentWrapperContainer from "../containers/drawer/DrawerContentWrapperContainer";
import DialogWrapperContainer from "../containers/dialog/DialogWrapperContainer";

const styles = theme => ({
  root: {
    flexGrow: 1,
    flexWrap: "wrap",
    height: "100vh",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex"
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  },
  fabMoveUp: {
    transform: "translate3d(0, -46px, 0)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeOut
    })
  },
  fabMoveDown: {
    transform: "translate3d(0, 0, 0)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    })
  },
  button: {
    margin: theme.spacing.unit
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: DRAWER_WIDTH,
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
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});

//Handles the composition of the application as well as drawer state changes and the snackbar
class OrganizerApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };

    //Bind functions in constructor so a new function isn't made in every render
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.handleSnackbarExited = this.handleSnackbarExited.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  handleDrawerOpen() {
    this.setState({
      open: true
    });
  }

  handleDrawerClose() {
    this.setState({
      open: false
    });
  }

  handleSnackbarClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    this.lastSnackbar = this.props.currentSnackbar;
    this.props.finishCurrentSnackbar();
  }

  handleSnackbarExited() {
    if (this.props.snackbarQueueLength > 0) {
      this.props.processSnackbarQueue();
    }
  }

  updateWindowDimensions() {
    //Dispatch update of window size to redux
    this.props.updateWindowDimensions(window.innerWidth, window.innerHeight);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  render() {
    const {
      classes,
      currentSnackbar,
      snackbarOpen,
      isLoading,
      windowWidth
    } = this.props;
    const fabClasses = classNames(
      classes.fab,
      snackbarOpen && windowWidth <= SNACKBAR_EXPAND_QUERY_WIDTH
        ? classes.fabMoveUp
        : classes.fabMoveDown
    );
    let autohideDuration = SNACKBAR_AUTOHIDE_DURATION_DEFAULT;

    if (currentSnackbar) {
      autohideDuration = currentSnackbar.autohideDuration;
    }

    return (
      <div>
        {isLoading && <LinearIndeterminate />}
        <div className={classes.root}>
          <NavContainer
            open={this.state.open}
            onDrawerBtnClick={this.handleDrawerOpen}
          />
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(
                classes.drawerPaper,
                !this.state.open && classes.drawerPaperClose
              )
            }}
            open={this.state.open}
          >
            <DrawerContentWrapperContainer
              handleDrawerClose={this.handleDrawerClose}
              drawerOpen={this.state.open}
            />
          </Drawer>
          <ContentWrapperContainer drawerOpen={this.state.open} />
          <Button
            variant="extendedFab"
            aria-label="Add"
            className={fabClasses}
            color="primary"
          >
            <EditIcon className={classes.extendedIcon} />
            Add Receipt
          </Button>
          <Snackbar
            anchorOrigin={{
              vertical: SNACKBAR_VERTICAL,
              horizontal: SNACKBAR_HORIZONTAL
            }}
            open={snackbarOpen}
            autoHideDuration={currentSnackbar ? autohideDuration : null}
            onClose={this.handleSnackbarClose}
            onExited={this.handleSnackbarExited}
          >
            {currentSnackbar && (
              <SnackbarContentWrapper
                onClose={this.handleSnackbarClose}
                variant={currentSnackbar.variant}
                message={currentSnackbar.msg}
                actions={currentSnackbar.actions}
                handlers={currentSnackbar.handlers}
                handlerParams={currentSnackbar.handlerParams}
              />
            )}
          </Snackbar>
          <DialogWrapperContainer />
        </div>
      </div>
    );
  }
}

OrganizerApp.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  snackbarOpen: PropTypes.bool.isRequired,
  currentSnackbar: PropTypes.object,
  snackbarQueueLength: PropTypes.number.isRequired,
  windowWidth: PropTypes.number.isRequired,
  processSnackbarQueue: PropTypes.func.isRequired,
  finishCurrentSnackbar: PropTypes.func.isRequired,
  updateWindowDimensions: PropTypes.func.isRequired
};

export default withStyles(styles, {
  withTheme: true
})(OrganizerApp);
