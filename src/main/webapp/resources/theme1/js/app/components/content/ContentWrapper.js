import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import ReceiptViewOptionBar from "./ReceiptViewOptionBar";
import {
  DRAWER_WIDTH,
  APP_BAR_HEIGHT,
  RECEIPT_LOADER_SPEED,
  LOADER_RECT_RX,
  LOADER_RECT_RY,
  RECEIPT_RECT_HEIGHT,
  DRAWER_WIDTH_CLOSED,
  RECEIPT_CARD_WIDTH
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
    this.state = {
      receiptPageStatuses: [],
      lastLoadedPage: 0
    };
    this.ContentRef = React.createRef();

    this.handleScroll = this.handleScroll.bind(this);
    this.loadNextPage = this.loadNextPage.bind(this);
  }

  handleScroll() {
    const { currentPage, numPages } = this.props;
    const nextPage = currentPage + 1;

    //TODO: Improve to handle failures in loadReceiptPage
    //TODO: Fix queries not working. Ex: "Ohio"
    if (
      this.ContentRef.current.scrollTop /
        this.ContentRef.current.scrollHeight >=
        0.5 &&
      nextPage < numPages &&
      !this.state.receiptPageStatuses[nextPage].isLoaded
    ) {
      this.setState(
        prevState => ({
          receiptPageStatuses: [
            ...prevState.receiptPageStatuses.map(function(el, ind) {
              if (ind === nextPage) {
                el.isLoaded = true;
              }
              return el;
            })
          ],
          lastLoadedPage: nextPage
        }),
        this.loadNextPage
      );
    }
  }

  loadNextPage() {
    this.props.loadReceiptPage(this.props.currentPage + 1);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.query !== this.props.query ||
      !_.isEqual(prevProps.activeLabels, this.props.activeLabels) ||
      this.state.lastLoadedPage !== this.props.currentPage
    ) {
      //Reset receiptPageStatuses on new queries and active label changes
      this.setState({
        receiptPageStatuses: [...Array(this.props.numPages).keys()].map(
          function(el, ind) {
            return ind === 0 ? { isLoaded: true } : { isLoaded: false };
          }
        )
      });
    }
  }

  componentDidMount() {
    const self = this;
    this.ContentRef.current.addEventListener("scroll", this.handleScroll);
    this.props.queryReceipts("").then(function(result) {
      self.setState({
        receiptPageStatuses: [...Array(self.props.numPages).keys()].map(
          function(el, ind) {
            return ind === 0 ? { isLoaded: true } : { isLoaded: false };
          }
        )
      });
    });
  }

  componentWillUnmount() {
    this.ContentRef.current.removeEventListener("scroll", this.handleScroll);
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
    if (drawerOpen) {
      receiptLoadingWidth =
        receiptLoadingWidth - DRAWER_WIDTH < 0
          ? 0
          : (receiptLoadingWidth -= DRAWER_WIDTH);
    }

    const numReceiptColumns = Math.floor(
      receiptLoadingWidth / RECEIPT_CARD_WIDTH
    );

    let contentView = (
      <div>
        <ReceiptViewOptionBar
          activeLabels={activeLabels}
          removeActiveLabel={removeActiveLabel}
          currentPage={currentPage}
          query={query}
        />
        <ReceiptCardList receipts={receipts} numColumns={numReceiptColumns} />
      </div>
    );

    //The empty toolbar keeps everything pushed under the appbar
    return (
      <main
        className={classNames(
          classes.content,
          drawerOpen
            ? classes.contentMediaQueryOpen
            : classes.contentMediaQueryClose
        )}
        ref={this.ContentRef}
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
  loadReceiptPage: PropTypes.func.isRequired,
  queryReceipts: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  currentPage: PropTypes.number.isRequired,
  receipts: PropTypes.array.isRequired,
  numPages: PropTypes.number,
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  view: PropTypes.string.isRequired
};

export default withStyles(styles, {
  withTheme: true
})(ContentWrapper);
