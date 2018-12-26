import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardHeader,
  IconButton,
  Avatar,
  CardActions,
  Collapse,
  CardActionArea
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FavoriteIcon from "@material-ui/icons/Favorite";

import {
  GET_RECEIPT_FILE_PATH,
  RECEIPT_CARD_WIDTH
} from "../../../common/constants";
import classnames from "classnames";

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
  }
});

class ReceiptCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };

    this.handleExpandClick = this.handleExpandClick.bind(this);
  }

  handleExpandClick() {
    this.setState(state => ({ expanded: !state.expanded }));
  }

  render() {
    const { classes, theme, receipt } = this.props;

    //TODO: Use label avatar instead of hard coded one
    //TODO: Don't show until the image has loaded (failed or successful)
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Receipt" className={classes.avatar}>
              {receipt.vendor ? receipt.vendor.substring(0, 1) : "?"}
            </Avatar>
          }
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={receipt.title ? receipt.title : ""}
          subheader={receipt.vendor ? receipt.vendor : ""}
        />
        <div className={classes.body}>
          <CardActionArea>
            <CardMedia
              component="img"
              className={classes.media}
              image={GET_RECEIPT_FILE_PATH.format(receipt.id, receipt.fileName)}
              title={receipt.title ? receipt.title : ""}
            />
          </CardActionArea>
        </div>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton>
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
  receipt: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ReceiptCard);
