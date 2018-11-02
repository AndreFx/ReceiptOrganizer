import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//Custom imports
import ReceiptViewOptionBar from './ReceiptViewOptionBar';
import { DRAWER_WIDTH, APP_BAR_HEIGHT, RECEIPT_LOADER_SPEED, LOADER_RECT_RX, LOADER_RECT_RY, RECEIPT_RECT_HEIGHT } from '../../../common/constants';
import ContentLoaderWrapper from '../loading/ContentLoaderWrapper';

const styles = theme => ({
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
    },
});

const RECT_X = 20;
const RECT_START_Y = 20;
const SPACE_USED = RECEIPT_RECT_HEIGHT + 20;

class ContentWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0
        };

        //Bind functions in constructor so a new function isn't made in every render
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    updateWindowDimensions() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
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
            currentReceiptPage 
        } = this.props;

        let receiptLoadingWidth = this.state.width;
        let receiptLoadingHeight = this.state.height - APP_BAR_HEIGHT < 0 ? 0 : this.state.height - APP_BAR_HEIGHT;
        //Calculate number of loading rects
        let possibleLength = Math.floor(receiptLoadingHeight / SPACE_USED);
        let loadingArrLength = possibleLength < 0 ? 0 : possibleLength;

        if (drawerOpen) {
            receiptLoadingWidth = (receiptLoadingWidth - DRAWER_WIDTH) < 0 ? 0 : receiptLoadingWidth -= DRAWER_WIDTH; 
        }

        //The empty toolbar keeps everything pushed under the appbar
        return (
            <main className={classes.content} >
                <div className={classes.toolbar} />
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
                            Array(loadingArrLength).fill().map(function(el, i) {
                                let adjustedSpace = SPACE_USED * i;
                                return [
                                    <rect key={"receiptRect" + i} x={RECT_X} y={RECT_START_Y + adjustedSpace} rx={LOADER_RECT_RX} ry={LOADER_RECT_RY} width={receiptLoadingWidth - RECT_X} height={RECEIPT_RECT_HEIGHT} />
                                ];
                            })
                        }
                    />
                    :
                    null //TODO: Put receipt card list here
                }
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
    csrfHeaderName: PropTypes.string.isRequired,
    csrfToken: PropTypes.string.isRequired,
    updateActiveLabels: PropTypes.func.isRequired,
    query: PropTypes.string,
    currentReceiptPage: PropTypes.number
};

export default withStyles(styles, { withTheme: true })(ContentWrapper);