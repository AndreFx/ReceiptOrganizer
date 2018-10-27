//UI Constants

/* UI Sizes */
export const DRAWER_WIDTH = 360;
export const ITEM_HEIGHT = 48;

/* Label Menu Items */
export const LABEL_MENU_EDIT = 'Edit';
export const LABEL_MENU_DELETE = 'Delete';
export const LABEL_MENU_OPTIONS = [
    LABEL_MENU_EDIT,
    LABEL_MENU_DELETE
];

/* Create Label UI Text */
export const CREATE_LABEL_UI_TITLE = 'Create Label';
export const CREATE_LABEL_DIALOG_HELP = 'Categorize your receipts! Enter a unique name below to begin categorizing your receipts.';
export const CREATE_LABEL_DIALOG_INPUT_PLACEHOLDER = "Label Name";
export const CREATE_LABEL_CANCEL = 'Cancel';
export const CREATE_LABEL_SUBMIT = 'Create';

//Dialog Defaults

/* Default Text */
export const DIALOG_CANCEL = 'Exit';
export const DIALOG_SUBMIT = 'Submit';

//Snackbar Constants

/* Default snackbar location */
export const SNACKBAR_VERTICAL = 'bottom';
export const SNACKBAR_HORIZONTAL = 'center';

/* Default AutoHide Duration */
export const SNACKBAR_AUTOHIDE_DURATION_DEFAULT = 5000;
export const SNACKBAR_AUTOHIDE_DURATION_SHORT = 3000;
export const SNACKBAR_AUTOHIDE_DISABLED = null;

/* Snackbar variants */
export const SUCCESS_SNACKBAR = 'success';
export const WARNING_SNACKBAR = 'warning';
export const ERROR_SNACKBAR = 'error';
export const INFO_SNACKBAR = 'info';

/* Snackbar Actions */
export const SNACKBAR_ACTION_RETRY = 'Retry';

//URLS
export const LOGOUT_URL = '/ReceiptOrganizer/logout';
export const SEARCH_URL = '/ReceiptOrganizer/receipts';
export const SETTINGS_URL = '/ReceiptOrganizer/users/settings';
export const GET_LABELS_URL = '/ReceiptOrganizer/labels/';
export const ADD_LABEL_URL = '/ReceiptOrganizer/labels/create';
export const DELETE_LABEL_URL = '/ReceiptOrganizer/labels/delete';

//Service Errors
export const SERVER_ERROR = 'Unable to reach server';

//Login Error Messages
export const INVALID_USERNAME_MESSAGE = 'Username is required';
export const INVALID_PASSWORD_MESSAGE = 'Password is required';
