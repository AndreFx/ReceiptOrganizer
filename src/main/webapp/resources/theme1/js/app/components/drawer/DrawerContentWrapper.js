import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CategoryIcon from '@material-ui/icons/Category'
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';

import LabelListContainer from '../../containers/labels/LabelListContainer';
import CreateLabelButtonWrapperContainer from '../../containers/labels/CreateLabelButtonWrapperContainer';
import { USER_THUMBNAIL_URL } from '../../../common/constants';

const styles = theme => ({
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
    avatar: {
        margin: 5,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});

class DrawerContentWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoriesOpen: true
        };

        //Bind functions in constructor so a new function isn't made in every render
        this.handleCategoriesClick = this.handleCategoriesClick.bind(this);
    }

    handleCategoriesClick() {
        this.setState({
            categoriesOpen: !this.state.categoriesOpen
        });
    }

    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        const { classes, theme, username, handleDrawerClose, drawerOpen } = this.props;

        return (
            <div>
                <div className={classes.toolbar}>
                    <div className={classes.toolbarUserInfo}>
                        <Avatar alt="User Avatar" src={USER_THUMBNAIL_URL} className={classes.avatar} />
                        <Typography variant="subtitle1" >
                            {username}
                        </Typography>
                    </div>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button onClick={this.handleCategoriesClick}>
                        <ListItemIcon>
                            <CategoryIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Categories" />
                        {this.state.categoriesOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.categoriesOpen} timeout="auto" >
                        <LabelListContainer drawerOpen={drawerOpen} listItemClassName={drawerOpen ? classes.nested : null} />
                    </Collapse>
                </List>
                <Divider />
                <CreateLabelButtonWrapperContainer />
            </div>
        );
    }
}

DrawerContentWrapper.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    handleDrawerClose: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(DrawerContentWrapper);