import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Label from "./Label";
import { APP_BAR_HEIGHT } from "../../../common/constants";

const styles = theme => ({
  categoryList: {
    maxHeight: "calc(100vh - " + APP_BAR_HEIGHT * 3 + "px)",
    overflowY: "auto",
    overflowX: "hidden"
  }
});

class LabelList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchLabels();
  }

  render() {
    const {
      classes,
      labels,
      deleteLabel,
      editLabel,
      openDialog,
      closeDialog,
      addActiveLabel,
      editActiveLabel,
      removeActiveLabel,
      activeLabels,
      query,
      currentReceiptPage,
      drawerOpen,
      listItemClassName,
      updateContentView
    } = this.props;

    return (
      <List className={classes.categoryList}>
        {" "}
        {labels.map((l, ind) => (
          <Label
            key={l.name}
            label={l}
            deleteLabel={deleteLabel}
            editLabel={editLabel}
            openDialog={openDialog}
            closeDialog={closeDialog}
            addActiveLabel={addActiveLabel}
            editActiveLabel={editActiveLabel}
            removeActiveLabel={removeActiveLabel}
            activeLabels={activeLabels}
            query={query}
            currentReceiptPage={currentReceiptPage}
            drawerOpen={drawerOpen}
            listItemClassName={listItemClassName}
            updateContentView={updateContentView}
          />
        ))}
      </List>
    );
  }
}

LabelList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  activeLabels: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  query: PropTypes.string,
  currentReceiptPage: PropTypes.number,
  listItemClassName: PropTypes.string.isRequired,
  openDialog: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
  fetchLabels: PropTypes.func.isRequired,
  deleteLabel: PropTypes.func.isRequired,
  editLabel: PropTypes.func.isRequired,
  editActiveLabel: PropTypes.func.isRequired,
  addActiveLabel: PropTypes.func.isRequired,
  removeActiveLabel: PropTypes.func.isRequired,
  drawerOpen: PropTypes.bool.isRequired,
  updateContentView: PropTypes.func.isRequired
};

export default withStyles(styles, {
  withTheme: true
})(LabelList);
