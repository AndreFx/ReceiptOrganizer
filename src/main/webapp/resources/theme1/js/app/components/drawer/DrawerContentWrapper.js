import React from 'react';
import PropTypes from 'prop-types';
import {
    withStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CategoryIcon from '@material-ui/icons/Category';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';

import LabelListContainer from '../../containers/labels/LabelListContainer';
import CreateLabelButtonWrapperContainer from '../../containers/labels/CreateLabelButtonWrapperContainer';
import {
    USER_THUMBNAIL_PATH,
    DRAWER_WIDTH,
    LABEL_LOADER_SPEED,
    USER_LOADER_HEIGHT,
    USER_LOADER_SPEED,
    LOADER_RECT_RX,
    LOADER_RECT_RY,
    APP_BAR_HEIGHT
} from '../../../common/constants';
import ContentLoaderWrapper from '../loading/ContentLoaderWrapper';

const styles = theme => ({
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    loadingToolbar: {
        display: 'block',
        ...theme.mixins.toolbar
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
    hidden: {
        display: 'none'
    },
});

/* Label loading consts */
const CIRCLE_START_X = 35;
const CIRCLE_START_Y = 35;
const CIRCLE_R = 30;
const RECT_X = 75;
const LONG_RECT_START_Y = 16.67;
const LONG_RECT_WIDTH = 270;
const LONG_RECT_HEIGHT = 15;
const SHORT_RECT_START_Y = 44;
const SHORT_RECT_WIDTH = 135;
const SHORT_RECT_HEIGHT = 8;
const SPACE_USED = 65;

/* User loading consts */
const USER_CIRCLE_R = 28;

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
        const {
            classes,
            theme,
            username,
            handleDrawerClose,
            drawerOpen,
            isLabelsInitializing,
            isUserInitializing,
            windowHeight
        } = this.props;

        let labelLoadingHeight = windowHeight - APP_BAR_HEIGHT < 0 ? 0 : windowHeight - APP_BAR_HEIGHT;
        //Calculate number of loading rects
        let possibleLength = Math.floor(labelLoadingHeight / (SPACE_USED));
        let loadingArrLength = possibleLength < 0 ? 0 : possibleLength;

        return (
            <div>
                {
                    isUserInitializing ?
                        <div className={classes.loadingToolbar} >
                            <ContentLoaderWrapper
                                visible={isUserInitializing && drawerOpen}
                                height={USER_LOADER_HEIGHT}
                                width={DRAWER_WIDTH}
                                speed={USER_LOADER_SPEED}
                                svgElements={
                                    [
                                        <circle
                                            key={"circle1"}
                                            cx={CIRCLE_START_X}
                                            cy={CIRCLE_START_Y}
                                            r={USER_CIRCLE_R}
                                        />,
                                        <rect
                                            key={"longRect1"}
                                            x={RECT_X}
                                            y={LONG_RECT_START_Y}
                                            rx={LOADER_RECT_RX}
                                            ry={LOADER_RECT_RY}
                                            width={LONG_RECT_WIDTH}
                                            height={LONG_RECT_HEIGHT}
                                        />,
                                        <rect
                                            key={"shortRect1"}
                                            x={RECT_X}
                                            y={SHORT_RECT_START_Y}
                                            rx={LOADER_RECT_RX}
                                            ry={LOADER_RECT_RY}
                                            width={SHORT_RECT_WIDTH}
                                            height={SHORT_RECT_HEIGHT}
                                        />
                                    ]
                                }
                            />
                        </div>
                        :
                        <div className={classes.toolbar}>
                            <div className={classes.toolbarUserInfo}>
                                <Avatar
                                    alt="User Avatar"
                                    src={USER_THUMBNAIL_PATH}
                                    className={classes.avatar}
                                />
                                <Typography variant="subtitle1">{username}</Typography>
                            </div>
                            <IconButton onClick={handleDrawerClose} >
                                {theme.direction === 'rtl' ? < ChevronRightIcon /> : < ChevronLeftIcon />}
                            </IconButton>
                        </div>
                }
                <Divider />
                <div>
                    <List>
                        <ListItem
                            button
                            onClick={this.handleCategoriesClick}
                            className={isLabelsInitializing ? classes.hidden : null}
                        >
                            <ListItemIcon >
                                <CategoryIcon />
                            </ListItemIcon>
                            <ListItemText
                                inset
                                primary="Categories"
                            />
                            {
                                this.state.categoriesOpen ? < ExpandLess /> : < ExpandMore />
                            }
                        </ListItem>
                        <Collapse in={this.state.categoriesOpen} timeout="auto" >
                            <ContentLoaderWrapper
                                visible={isLabelsInitializing && drawerOpen}
                                height={labelLoadingHeight}
                                width={DRAWER_WIDTH}
                                speed={LABEL_LOADER_SPEED}
                                svgElements={
                                    Array(loadingArrLength).fill().map(function (el, i) {
                                        let adjustedSpace = SPACE_USED * i;
                                        return [
                                            <circle
                                                key={"circle" + i}
                                                cx={CIRCLE_START_X}
                                                cy={CIRCLE_START_Y + adjustedSpace}
                                                r={CIRCLE_R}
                                            />,
                                            <rect
                                                key={"longRect" + i}
                                                x={RECT_X}
                                                y={LONG_RECT_START_Y + adjustedSpace}
                                                rx={LOADER_RECT_RX}
                                                ry={LOADER_RECT_RY}
                                                width={LONG_RECT_WIDTH}
                                                height={LONG_RECT_HEIGHT}
                                            />,
                                            <rect
                                                key={"shortRect" + i}
                                                x={RECT_X}
                                                y={SHORT_RECT_START_Y + adjustedSpace}
                                                rx={LOADER_RECT_RX}
                                                ry={LOADER_RECT_RY}
                                                width={SHORT_RECT_WIDTH}
                                                height={SHORT_RECT_HEIGHT}
                                            />
                                        ];
                                    }).flat()
                                }
                            />
                            <LabelListContainer drawerOpen={drawerOpen} listItemClassName={drawerOpen ? classes.nested : null} />
                        </Collapse>
                    </List>
                    {
                        !isLabelsInitializing &&
                        <div>
                            <Divider />
                            <CreateLabelButtonWrapperContainer />
                        </div>
                    }
                </div>
            </div>
        );
    }
}

DrawerContentWrapper.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    isLabelsInitializing: PropTypes.bool.isRequired,
    isUserInitializing: PropTypes.bool.isRequired,
    handleDrawerClose: PropTypes.func.isRequired,
    windowHeight: PropTypes.number.isRequired
};

export default withStyles(styles, {
    withTheme: true
})(DrawerContentWrapper);
