import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { fade } from "@material-ui/core/styles/colorManipulator";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MoreIcon from "@material-ui/icons/MoreVert";
import ClearIcon from "@material-ui/icons/Clear";
import {
  Typography,
  InputAdornment,
  Menu,
  MenuItem,
  IconButton,
  AppBar,
  Toolbar,
  withStyles,
  Input
} from "@material-ui/core";
import {
  DRAWER_WIDTH,
  LOGIN_PATH,
  SNACKBAR_ACTION_RETRY,
  RECEIPT_LIBRARY
} from "../../../common/constants";

const styles = theme => ({
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    },
    cursor: "pointer"
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit * 3,
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200
      }
    }
  },
  clearButton: {
    color: "#ffffff",
    width: 48
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
});

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
      queryString: ""
    };

    //Bind functions in constructor so a new function isn't made in every render
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleProfileMenuOpen = this.handleProfileMenuOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this);
    this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchClear = this.handleSearchClear.bind(this);
    this.onEnterPressed = this.onEnterPressed.bind(this);
    this.handleTitleClick = this.handleTitleClick.bind(this);
  }

  handleTitleClick() {
    this.props.updateContentView(RECEIPT_LIBRARY);
  }

  handleDrawerOpen() {
    this.props.onDrawerBtnClick();
  }

  handleProfileMenuOpen(event) {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  handleMenuClose() {
    this.setState({
      anchorEl: null
    });
    this.handleMobileMenuClose();
  }

  handleMobileMenuOpen(event) {
    this.setState({
      mobileMoreAnchorEl: event.currentTarget
    });
  }

  handleMobileMenuClose() {
    this.setState({
      mobileMoreAnchorEl: null
    });
  }

  handleLogout() {
    this.props
      .logoutUser(SNACKBAR_ACTION_RETRY, this.handleLogout)
      .then(function(response) {
        if (response) {
          window.location = LOGIN_PATH;
        }
      });
  }

  handleSearchInput(event) {
    const value = event.target.value;
    this.setState({
      queryString: value
    });
  }

  onEnterPressed(event) {
    if (event.keyCode == 13 && event.shiftKey == false) {
      event.preventDefault();
      this.handleSearch();
    }
  }

  handleSearch() {
    this.props.queryReceipts(this.state.queryString);
  }

  handleSearchClear() {
    this.setState({
      queryString: ""
    });
  }

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const classes = this.props.classes;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

    return (
      <div>
        <AppBar
          position="absolute"
          className={classNames(
            classes.appBar,
            this.props.open && classes.appBarShift
          )}
        >
          <Toolbar>
            <IconButton
              className={classNames(
                classes.menuButton,
                this.props.open && classes.hide
              )}
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              className={classes.title}
              variant="h6"
              color="inherit"
              noWrap
              onClick={this.handleTitleClick}
            >
              Receipt Organizer
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon onClick={this.handleSearch} />
              </div>
              <Input
                placeholder="Search…"
                disableUnderline
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                value={this.state.queryString}
                endAdornment={
                  <InputAdornment
                    position="end"
                    className={classes.clearButton}
                  >
                    <IconButton
                      aria-label="Clear"
                      color="inherit"
                      onClick={this.handleSearchClear}
                    >
                      {this.state.queryString ? <ClearIcon /> : null}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={this.handleSearchInput}
                onKeyDown={this.onEnterPressed}
              />
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton
                aria-owns={isMenuOpen ? "material-appbar" : null}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onDrawerBtnClick: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  queryReceipts: PropTypes.func.isRequired,
  updateContentView: PropTypes.func.isRequired
};

export default withStyles(styles)(NavBar);
