import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//Custom imports
import ReceiptViewOptionBar from './ReceiptViewOptionBar';

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
        padding: theme.spacing.unit * 3,
    },
});

class ContentWrapper extends React.Component {
    constructor(props) {
        super(props);
        
        //Bind functions in constructor so a new function isn't made in every render
    }

    render() {
        const { classes, activeLabels, csrfHeaderName, csrfToken, updateActiveLabels, query, currentReceiptPage } = this.props;

        return (
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <ReceiptViewOptionBar
                    activeLabels={activeLabels}
                    csrfHeaderName={csrfHeaderName}
                    csrfToken={csrfToken}
                    updateActiveLabels={updateActiveLabels}
                    query={query}
                    currentReceiptPage={currentReceiptPage}
                />
            </main>
        );
    }
}

ContentWrapper.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    activeLabels: PropTypes.array,
    csrfHeaderName: PropTypes.string.isRequired,
    csrfToken: PropTypes.string.isRequired,
    updateActiveLabels: PropTypes.func.isRequired,
    query: PropTypes.string,
    currentReceiptPage: PropTypes.number
};

export default withStyles(styles, { withTheme: true })(ContentWrapper);