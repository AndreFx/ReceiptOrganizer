import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
    root: {
        flexGrow: 1,
        width: '100%'
    },
    linearProgress: {
        height: '2vh'
    }
};

function LinearIndeterminate(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <LinearProgress classes={classes.height}/>
        </div>
    );
}

LinearIndeterminate.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LinearIndeterminate);