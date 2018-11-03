import React from 'react';
import PropTypes from 'prop-types';
import {
    withStyles
} from '@material-ui/core/styles';

//Custom imports
import ReceiptViewOptionBar from './ReceiptViewOptionBar';
import {
    DRAWER_WIDTH,
    APP_BAR_HEIGHT,
    RECEIPT_LOADER_SPEED,
    LOADER_RECT_RX,
    LOADER_RECT_RY,
    RECEIPT_RECT_HEIGHT
} from '../../../common/constants';
import ContentLoaderWrapper from '../loading/ContentLoaderWrapper';

const styles = theme => ({
    content: {
        flex: '1 1',
        backgroundColor: theme.palette.background.default,
        padding: 'calc(' + APP_BAR_HEIGHT + 'px + 25px) 40px 25px'
    },
    contentMediaQuery: {
        '@media (min-width: 1024px)': {
            maxWidth: 'calc(100% - ' + DRAWER_WIDTH + 'px)'
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

    render() {
        const {
            classes,
            theme,
            isLoading,
            drawerOpen,
            activeLabels,
            csrfHeaderName,
            csrfToken,
            updateActiveLabels,
            query,
            currentReceiptPage,
            windowWidth,
            windowHeight
        } = this.props;
        let receiptLoadingWidth = windowWidth;
        let receiptLoadingHeight = windowHeight - APP_BAR_HEIGHT < 0 ? 0 : windowHeight - APP_BAR_HEIGHT;
        //Calculate number of loading rects
        let possibleLength = Math.floor(receiptLoadingHeight / SPACE_USED);
        let loadingArrLength = possibleLength < 0 ? 0 : possibleLength;

        if (drawerOpen) {
            receiptLoadingWidth = (receiptLoadingWidth - DRAWER_WIDTH) < 0 ? 0 : receiptLoadingWidth -= DRAWER_WIDTH;
        }

        //The empty toolbar keeps everything pushed under the appbar
        return (
            <main className={drawerOpen ? classes.content : classes.contentMediaQuery} >
                <ReceiptViewOptionBar
                    activeLabels={activeLabels}
                    csrfHeaderName={csrfHeaderName}
                    csrfToken={csrfToken}
                    updateActiveLabels={updateActiveLabels}
                    query={query}
                    currentReceiptPage={currentReceiptPage}
                />
                {
                    isLoading ?
                        <ContentLoaderWrapper
                            visible={isLoading}
                            height={receiptLoadingHeight}
                            width={receiptLoadingWidth}
                            speed={RECEIPT_LOADER_SPEED}
                            svgElements={
                                Array(loadingArrLength).fill().map(function (el, i) {
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
                                })
                            }
                        /> :
                        null //TODO: Put receipt card list here
                } </main>
        );
    }
}

ContentWrapper.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    activeLabels: PropTypes.array,
    csrfHeaderName: PropTypes.string.isRequired,
    csrfToken: PropTypes.string.isRequired,
    updateActiveLabels: PropTypes.func.isRequired,
    query: PropTypes.string,
    currentReceiptPage: PropTypes.number,
    windowWidth: PropTypes.number.isRequired,
    windowHeight: PropTypes.number.isRequired
};

export default withStyles(styles, {
    withTheme: true
})(ContentWrapper);
