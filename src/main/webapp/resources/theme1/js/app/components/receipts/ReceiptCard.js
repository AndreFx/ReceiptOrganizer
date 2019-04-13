import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import {
  Card,
  CardMedia,
  CardContent,
  CardHeader,
  IconButton,
  Avatar,
  CardActions,
  Collapse,
  CardActionArea,
  MenuItem,
  Menu
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FavoriteIcon from "@material-ui/icons/Favorite";

import {
  GET_RECEIPT_FILE_PATH,
  RECEIPT_CARD_WIDTH,
  RECEIPT_EDIT,
  RECEIPT_VIEW
} from "../../../common/constants";
import classnames from "classnames";
import {
  DELETE_RECEIPT_SUBMIT,
  DELETE_RECEIPT_CANCEL,
  DELETE_RECEIPT_DIALOG_HELP,
  DELETE_RECEIPT_DIALOG_TITLE
} from "../../../common/uiTextConstants";

const styles = theme => ({
  card: {
    width: RECEIPT_CARD_WIDTH
  },
  media: {
    objectFit: "cover"
  },
  avatar: {
    backgroundColor: red[500]
  },
  content: {
    flex: "1 0 auto"
  },
  body: {
    display: "flex"
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: "auto",
    [theme.breakpoints.up("sm")]: {
      marginRight: -8
    }
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  hidden: {
    display: "none"
  }
});

class ReceiptCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      menuAnchorEl: null,
      imageLoaded: false
    };

    this.handleExpandClick = this.handleExpandClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
    this.handleImageLoad = this.handleImageLoad.bind(this);
  }

  handleImageLoad() {
    this.setState({
      imageLoaded: true
    });
  }

  handleExpandClick() {
    this.setState(state => ({ expanded: !state.expanded }));
  }

  handleMenuClick(event) {
    this.setState({
      menuAnchorEl: event.currentTarget
    });
  }

  handleMenuClose() {
    this.setState({
      menuAnchorEl: null
    });
  }

  handleEdit(view) {
    const self = this;
    return function() {
      if (view) {
        self.props.updateActionDrawerView(RECEIPT_VIEW, {
          receipt: self.props.receipt
        });
      } else {
        self.props.updateActionDrawerView(RECEIPT_EDIT, {
          receipt: self.props.receipt
        });
      }
      self.props.toggleActionDrawer(true);
      self.handleMenuClose();
    };
  }

  handleDelete() {
    let options = {
      dialogText: DELETE_RECEIPT_DIALOG_HELP + this.props.receipt.title + "?",
      cancelText: DELETE_RECEIPT_CANCEL,
      submitText: DELETE_RECEIPT_SUBMIT
    };

    this.handleMenuClose();
    this.props.openDialog(
      DELETE_RECEIPT_DIALOG_TITLE,
      this.handleDeleteSubmit,
      this.props.closeDialog,
      options
    );
  }

  handleDeleteSubmit() {
    this.props.deleteReceipt(this.props.receipt.id);
  }

  render() {
    const { classes, receipt } = this.props;
    const { menuAnchorEl, imageLoaded } = this.state;

    return (
      <Card
        className={classNames(classes.card, !imageLoaded && classes.hidden)}
      >
        <CardHeader
          avatar={
            <Avatar aria-label="Receipt" className={classes.avatar}>
              {receipt.vendor ? receipt.vendor.substring(0, 1) : "?"}
            </Avatar>
          }
          action={
            <IconButton
              aria-owns={menuAnchorEl ? "card-menu" : undefined}
              aria-haspopup="true"
              onClick={this.handleMenuClick}
            >
              <MoreVertIcon />
            </IconButton>
          }
          title={receipt.title ? receipt.title : ""}
          subheader={receipt.vendor ? receipt.vendor : ""}
        />
        <Menu
          id="card-menu"
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={this.handleMenuClose}
        >
          <MenuItem onClick={this.handleEdit(false)}>Edit</MenuItem>
          <MenuItem onClick={this.handleDelete}>Delete</MenuItem>
        </Menu>
        <div className={classes.body}>
          <CardActionArea>
            <CardMedia
              onLoad={this.handleImageLoad}
              className={classes.media}
              component="img"
              image={GET_RECEIPT_FILE_PATH.format(receipt.id, receipt.fileName)}
              title={receipt.title ? receipt.title : ""}
              alt={receipt.title ? receipt.title : ""}
              onClick={this.handleEdit(true)}
            />
          </CardActionArea>
        </div>
        <CardActions className={classes.actions} disableActionSpacing>
          {/*TODO: <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton> */}
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show More"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes.content} />
        </Collapse>
      </Card>
    );
  }
}

ReceiptCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  receipt: PropTypes.object.isRequired,
  deleteReceipt: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
  toggleActionDrawer: PropTypes.func.isRequired,
  updateActionDrawerView: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(ReceiptCard);
