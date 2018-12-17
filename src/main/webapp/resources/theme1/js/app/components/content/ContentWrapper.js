import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

//Custom imports
import ReceiptViewOptionBar from "./ReceiptViewOptionBar";
import {
  DRAWER_WIDTH,
  APP_BAR_HEIGHT,
  RECEIPT_LOADER_SPEED,
  LOADER_RECT_RX,
  LOADER_RECT_RY,
  RECEIPT_RECT_HEIGHT,
  DRAWER_WIDTH_CLOSED
} from "../../../common/constants";
import ContentLoaderWrapper from "../loading/ContentLoaderWrapper";
import ReceiptCardList from "../receipts/ReceiptCardList";

const styles = theme => ({
  content: {
    flex: "1 1",
    backgroundColor: theme.palette.background.default,
    padding: "25px 40px 25px",
    marginTop: APP_BAR_HEIGHT + "px",
    overflowY: "scroll"
  },
  contentMediaQueryOpen: {
    "@media (min-width: 1024px)": {
      maxWidth: "calc(100% - " + DRAWER_WIDTH + "px)"
    }
  },
  contentMediaQueryClose: {
    "@media (min-width: 1024px)": {
      maxWidth: "calc(100% - " + DRAWER_WIDTH_CLOSED + "px)"
    }
  }
});

const RECT_X = 20;
const RECT_START_Y = 20;
const SPACE_USED = RECEIPT_RECT_HEIGHT + 20;

class ContentWrapper extends React.Component {
  constructor(props) {
    super(props);

    //Bind functions in constructor so a new function isn't made in every render
  }

  componentDidMount() {
    this.props.changeReceiptPage(this.props.currentPage).then(function(result) {
      //Do something here!
    });
  }

  render() {
    const {
      classes,
      theme,
      isLoading,
      drawerOpen,
      activeLabels,
      removeActiveLabel,
      currentPage,
      query,
      receipts,
      windowWidth,
      windowHeight,
      view
    } = this.props;
    let receiptLoadingWidth = windowWidth;
    let receiptLoadingHeight =
      windowHeight - APP_BAR_HEIGHT < 0 ? 0 : windowHeight - APP_BAR_HEIGHT;
    //Calculate number of loading rects
    let possibleLength = Math.floor(receiptLoadingHeight / SPACE_USED);
    let loadingArrLength = possibleLength < 0 ? 0 : possibleLength;
    let contentView = (
      <div>
        <ReceiptViewOptionBar
          activeLabels={activeLabels}
          removeActiveLabel={removeActiveLabel}
          currentPage={currentPage}
          query={query}
        />
        <ReceiptCardList receipts={receipts} currentPage={currentPage} />
      </div>
    );

    if (drawerOpen) {
      receiptLoadingWidth =
        receiptLoadingWidth - DRAWER_WIDTH < 0
          ? 0
          : (receiptLoadingWidth -= DRAWER_WIDTH);
    }

    //The empty toolbar keeps everything pushed under the appbar
    return (
      <main
        className={classNames(
          classes.content,
          drawerOpen
            ? classes.contentMediaQueryOpen
            : classes.contentMediaQueryClose
        )}
      >
        {isLoading ? (
          <ContentLoaderWrapper
            visible={isLoading}
            height={receiptLoadingHeight}
            width={receiptLoadingWidth}
            speed={RECEIPT_LOADER_SPEED}
            svgElements={Array(loadingArrLength)
              .fill()
              .map(function(el, i) {
                let adjustedSpace = SPACE_USED * i;
                return [
                  <rect
                    key={"receiptRect" + i}
                    x={RECT_X}
                    y={RECT_START_Y + adjustedSpace}
                    rx={LOADER_RECT_RX}
                    ry={LOADER_RECT_RY}
                    width={receiptLoadingWidth - RECT_X}
                    height={RECEIPT_RECT_HEIGHT}
                  />
                ];
              })}
          />
        ) : (
          contentView
        )}{" "}
      </main>
    );
  }
}

ContentWrapper.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  drawerOpen: PropTypes.bool.isRequired,
  activeLabels: PropTypes.array,
  removeActiveLabel: PropTypes.func.isRequired,
  changeReceiptPage: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  currentPage: PropTypes.number.isRequired,
  receipts: PropTypes.array.isRequired,
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  view: PropTypes.string.isRequired
};

export default withStyles(styles, {
  withTheme: true
})(ContentWrapper);
