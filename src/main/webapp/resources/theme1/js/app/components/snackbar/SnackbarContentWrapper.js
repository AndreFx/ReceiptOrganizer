import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import {
    withStyles
} from '@material-ui/core/styles';

//Custom imports
import {
    SUCCESS_SNACKBAR,
    WARNING_SNACKBAR,
    ERROR_SNACKBAR,
    INFO_SNACKBAR,
    SNACKBAR_ACTION_RETRY
} from '../../../common/constants';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const styles = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

function SnackbarContentWrapper(props) {
    const {
        classes,
        className,
        message,
        onClose,
        variant,
        actions,
        handlers,
        handlerParams
    } = props;
    const Icon = variantIcon[variant];
    let snackbarActions = [];

    actions.forEach(function (element, index) {
        if (element === SNACKBAR_ACTION_RETRY) {
            snackbarActions.push(
                <Button
                    key={SNACKBAR_ACTION_RETRY}
                    aria-label={SNACKBAR_ACTION_RETRY}
                    color="inherit"
                    size="small"
                    onClick={(e) => { onClose(e); handlers[index](e, ...handlerParams[index]); }}
                >
                    {
                        SNACKBAR_ACTION_RETRY
                    }
                </Button>
            );
        }
    });

    snackbarActions.push(
        <IconButton key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={onClose}
        >
            <CloseIcon className={classes.icon}
            />
        </IconButton>
    );


    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message} >
                    <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    {
                        message
                    }
                </span>
            }
            action={snackbarActions}
        />
    );
}

SnackbarContentWrapper.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    message: PropTypes.node,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf([SUCCESS_SNACKBAR, WARNING_SNACKBAR, ERROR_SNACKBAR, INFO_SNACKBAR]).isRequired,
    actions: PropTypes.array.isRequired,
    handlers: PropTypes.array.isRequired,
    handlerParams: PropTypes.array.isRequired
};

export default withStyles(styles)(SnackbarContentWrapper);
