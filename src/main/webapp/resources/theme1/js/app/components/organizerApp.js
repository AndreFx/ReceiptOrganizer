import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import CategoryIcon from '@material-ui/icons/Category'
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

//Custom imports
import { DRAWER_WIDTH, SNACKBAR_VERTICAL, SNACKBAR_HORIZONTAL, SNACKBAR_AUTOHIDE_DURATION_DEFAULT, USER_THUMBNAIL_URL } from '../../common/constants';
import LinearIndeterminate from './loading/linearIndeterminate';
import NavContainer from '../containers/navContainer';
import LabelListContainer from '../containers/labelListContainer';
import CreateLabelListContainer from '../containers/createLabelButtonWrapperContainer';
import SnackbarContentWrapper from './snackbar/snackbarContentWrapper';
import DialogWrapper from './dialog/dialogWrapper';
import ReceiptViewOptionBar from './content/receiptViewOptionBar';
import { Avatar } from '@material-ui/core';

const styles = theme => ({
    root: {
        flexGrow: 1,
        flexWrap: 'wrap',
        height: '100vh',
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    button: {
        margin: theme.spacing.unit,
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: DRAWER_WIDTH,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    toolbarUserInfo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
    loading: {
        height: '98vh',
    },
    avatar: {
        margin: 5,
    }
});

class OrganizerApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: true
        };

        //Bind functions in constructor so a new function isn't made in every render
        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
        this.handleDrawerClose = this.handleDrawerClose.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this.handleSnackbarExited = this.handleSnackbarExited.bind(this);

        this.lastSnackbar = {};
    }

    handleDrawerOpen() {
        this.setState({ open: true });
    };

    handleDrawerClose() {
        this.setState({ open: false });
    };

    handleSnackbarClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.lastSnackbar = this.props.currentSnackbar;
        this.props.finishCurrentSnackbar();
    }

    handleSnackbarExited() {
        if (this.props.snackbarQueueLength > 0) {
            this.props.processSnackbarQueue();
        }
    }

    componentDidMount() {
        this.props.fetchUser();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.currentSnackbar && this.props.currentSnackbar !== this.state.lastSnackbar) {
            //Keep last snackbar so we don't lose it while closing a snackbar
            
        }
    }

    render() {
        const { 
            classes, 
            theme, 
            //isLoading, 
            user,
            currentSnackbar, 
            snackbarOpen, 
            dialog, 
            updateActiveLabels,
            currentReceiptPage, 
            activeLabels, 
            query,
            csrfHeaderName, 
            csrfToken
        } = this.props;
        let autohideDuration = SNACKBAR_AUTOHIDE_DURATION_DEFAULT;
        let adjustedSnackbar = {};
        let isLoading = false; //TODO: Reimplement the loading bar to be less annoying

        //lastSnackbar gets set on close, so when lastSnackbar and currentSnackbar aren't equal,
        //we need to hold onto the lastSnackbar while closing
        if (!open && !_.isEqual(this.lastSnackbar, currentSnackbar)) {
            adjustedSnackbar = this.lastSnackbar;
        } else {
            adjustedSnackbar = currentSnackbar;
        }

        if (currentSnackbar) {
            autohideDuration = currentSnackbar.autohideDuration;
        }

        return (
            <div>
                {isLoading && (<LinearIndeterminate />)}
                <div className={classNames(classes.root, isLoading && classes.loading)}>
                    <NavContainer open={this.state.open} onDrawerBtnClick={this.handleDrawerOpen} />
                    <Drawer
                        variant="permanent"
                        classes={{
                            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
                        }}
                        open={this.state.open}
                    >
                        <div className={classes.toolbar}>
                            <div className={classes.toolbarUserInfo}>
                                <Avatar alt="User Avatar" src={USER_THUMBNAIL_URL} className={classes.avatar} />
                                <Typography variant="subtitle1" >
                                    {user && user.username}
                                </Typography>
                            </div>
                            <IconButton onClick={this.handleDrawerClose}>
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </div>
                        <Divider />
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <CategoryIcon />
                                </ListItemIcon>
                                <ListItemText primary="Categories" />
                            </ListItem>
                        </List>
                        <Divider />
                        <LabelListContainer drawerOpen={this.state.open} />
                        <Divider />
                        <CreateLabelListContainer />
                    </Drawer>
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
                    <Button variant="extendedFab" aria-label="Add" className={classes.fab} color="primary">
                        <EditIcon className={classes.extendedIcon} />
                        Add Receipt
                    </Button>
                    <Snackbar
                        anchorOrigin={{ 
                            vertical: SNACKBAR_VERTICAL,
                            horizontal: SNACKBAR_HORIZONTAL
                        }}
                        open={snackbarOpen}
                        autoHideDuration={adjustedSnackbar ? autohideDuration : null}
                        onClose={this.handleSnackbarClose}
                        onExited={this.handleSnackbarExited}
                    >
                        {
                            adjustedSnackbar &&
                            <SnackbarContentWrapper
                                onClose={this.handleSnackbarClose}
                                variant={adjustedSnackbar.variant}
                                message={adjustedSnackbar.msg}
                                actions={adjustedSnackbar.actions}
                                handlers={adjustedSnackbar.handlers}
                                handlerParams={adjustedSnackbar.handlerParams}
                            />
                        }
                    </Snackbar >
                    <DialogWrapper 
                        isLoading={isLoading}
                        open={dialog.open}  
                        title={dialog.title}
                        close={dialog.close}
                        submit={dialog.submit}
                        options={dialog.options}
                    />
                </div>
            </div>
        );
    }
}

OrganizerApp.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    processSnackbarQueue: PropTypes.func.isRequired,
    finishCurrentSnackbar: PropTypes.func.isRequired,
    dialog: PropTypes.object.isRequired,
    updateActiveLabels: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(OrganizerApp);