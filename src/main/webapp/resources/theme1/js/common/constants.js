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
export const CREATE_LABEL_UI_TITLE = 'Create Category';
export const CREATE_LABEL_DIALOG_HELP = 'Categorize your receipts! Enter a unique name below to begin categorizing your receipts.';
export const CREATE_LABEL_DIALOG_INPUT_PLACEHOLDER = 'Category Name';
export const CREATE_LABEL_CANCEL = 'Cancel';
export const CREATE_LABEL_SUBMIT = 'Create';

/* Edit Label UI Text */
export const EDIT_LABEL_DIALOG_TITLE = 'Edit Category';
export const EDIT_LABEL_DIALOG_HELP = 'Enter a new unique name below to replace ';
export const EDIT_LABEL_DIALOG_INPUT_PLACEHOLDER = 'New Category Name';
export const EDIT_LABEL_CANCEL = 'Cancel';
export const EDIT_LABEL_SUBMIT = 'Update';

/* Delete Label UI Text */
export const DELETE_LABEL_DIALOG_TITLE = 'Delete Category';
export const DELETE_LABEL_DIALOG_HELP = 'Are you sure want to delete ';
export const DELETE_LABEL_CANCEL = 'No';
export const DELETE_LABEL_SUBMIT = 'Yes';

/* Active label actions */
export const REMOVE_ACTIVE_LABEL = 'REMOVE';
export const ADD_ACTIVE_LABEL = 'ADD';
export const EDIT_ACTIVE_LABEL = 'EDIT';

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

//Network Requests
export const CONTENT_TYPE_JSON = 'application/json';

/* URLS */
export const LOGOUT_URL = '/ReceiptOrganizer/logout';
export const SEARCH_URL = '/ReceiptOrganizer/receipts';
export const SETTINGS_URL = '/ReceiptOrganizer/users/settings';

/* Labels */
export const GET_LABELS_URL = '/ReceiptOrganizer/labels/';
export const ADD_LABEL_URL = '/ReceiptOrganizer/labels/create';
export const DELETE_LABEL_URL = '/ReceiptOrganizer/labels/delete';
export const EDIT_LABEL_URL = '/ReceiptOrganizer/labels/update';

/* Receipts */
export const GET_RECEIPTS_URL = '/ReceiptOrganizer/receipts/';

//Service Errors
export const SERVER_ERROR = 'Unable to reach server';

//Login Error Messages
export const INVALID_USERNAME_MESSAGE = 'Username is required';
export const INVALID_PASSWORD_MESSAGE = 'Password is required';
