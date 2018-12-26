import React, { Component } from "react";
import PropTypes from "prop-types";

import ReceiptCard from "./ReceiptCard";
import { Grid } from "@material-ui/core";

class ReceiptCardList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { receipts, numColumns } = this.props;
    let columns = [];

    for (let j = 0; j < numColumns; j++) {
      columns.push([]);
    }

    for (let i = 0; i < receipts.length; i++) {
      columns[i % numColumns].push(receipts[i]);
    }

    //TODO: Fix the loader for the final design
    return (
      <Grid
        container
        spacing={8}
        alignItems="baseline"
        justify="space-around"
        direction="row"
      >
        {columns.map((arr, ind) => (
          <Grid key={ind} item>
            <Grid
              container
              spacing={24}
              alignItems="baseline"
              justify="flex-start"
              direction="column"
            >
              {arr.map((r, ind) => (
                <Grid key={r.id} item>
                  <ReceiptCard receipt={r} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
      </Grid>
    );
  }
}

ReceiptCardList.propTypes = {
  receipts: PropTypes.array.isRequired,
  numColumns: PropTypes.number.isRequired
};

export default ReceiptCardList;
