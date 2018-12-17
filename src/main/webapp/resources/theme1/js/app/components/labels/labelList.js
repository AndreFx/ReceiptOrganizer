import React from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";

//Custom Imports
import Label from "./Label";

class LabelList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchLabels();
  }

  render() {
    const {
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
      <List>
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

export default LabelList;
