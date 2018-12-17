//UI Constants
/* Content Views */
export const RECEIPT_LIBRARY = "RECEIPT_LIBRARY";

/* Action Drawer Views */
export const RECEIPT_CREATION = "RECEIPT_CREATION";

/* UI Sizes */
export const DRAWER_WIDTH = 360;
export const DRAWER_WIDTH_CLOSED = 72;
export const ACTION_DRAWER_WIDTH = "100%";
export const APP_BAR_HEIGHT = 64;
export const ITEM_HEIGHT = 48;
export const AUTO_CLOSE_DRAWER_WINDOW_WIDTH = 800;
export const SNACKBAR_EXPAND_QUERY_WIDTH = 960;

/* Label Loader UI */
export const LABEL_LOADER_SPEED = 2;

/* User Loader UI */
export const USER_LOADER_HEIGHT = 64;
export const USER_LOADER_SPEED = 2;

/* Receipt Loader UI */
export const RECEIPT_LOADER_SPEED = 2;
export const RECEIPT_RECT_HEIGHT = 200;

/* Receipt Creator UI */
export const RECEIPT_CREATION_TITLE = "Create a new receipt";
export const RECEIPT_CREATION_STEP_UPLOAD = "Upload receipt";
export const RECEIPT_CREATION_STEP_MODIFY_DATA = "Edit receipt content";
export const CURRENCY_FIXED_DECIMAL = 2;

/* Loader Rectangle attributes */
export const LOADER_RECT_RX = 4;
export const LOADER_RECT_RY = 4;

/* Label Menu Items */
export const LABEL_MENU_EDIT = "Edit";
export const LABEL_MENU_DELETE = "Delete";
export const LABEL_MENU_OPTIONS = [LABEL_MENU_EDIT, LABEL_MENU_DELETE];

/* Create Label UI Text */
export const CREATE_LABEL_UI_TITLE = "Create Category";
export const CREATE_LABEL_DIALOG_HELP =
  "Categorize your receipts! Enter a unique name below to begin categorizing your receipts.";
export const CREATE_LABEL_DIALOG_INPUT_PLACEHOLDER = "Category Name";
export const CREATE_LABEL_CANCEL = "Cancel";
export const CREATE_LABEL_SUBMIT = "Create";

/* Edit Label UI Text */
export const EDIT_LABEL_DIALOG_TITLE = "Edit Category";
export const EDIT_LABEL_DIALOG_HELP =
  "Enter a new unique name below to replace ";
export const EDIT_LABEL_DIALOG_INPUT_PLACEHOLDER = "New Category Name";
export const EDIT_LABEL_CANCEL = "Cancel";
export const EDIT_LABEL_SUBMIT = "Update";

/* Delete Label UI Text */
export const DELETE_LABEL_DIALOG_TITLE = "Delete Category";
export const DELETE_LABEL_DIALOG_HELP = "Are you sure want to delete ";
export const DELETE_LABEL_CANCEL = "No";
export const DELETE_LABEL_SUBMIT = "Yes";

//Dialog Defaults

/* Default Text */
export const DIALOG_CANCEL = "Exit";
export const DIALOG_SUBMIT = "Submit";

//User defaults
export const DEFAULT_USERNAME = "Unknown Username";
export const DEFAULT_FNAME = "Missing";
export const DEFAULT_LNAME = "Name";

//Snackbar Constants

/* Default snackbar location */
export const SNACKBAR_VERTICAL = "bottom";
export const SNACKBAR_HORIZONTAL = "center";

/* Default AutoHide Duration */
export const SNACKBAR_AUTOHIDE_DURATION_DEFAULT = 5000;
export const SNACKBAR_AUTOHIDE_DURATION_SHORT = 3000;
export const SNACKBAR_AUTOHIDE_DISABLED = null;

/* Snackbar variants */
export const SUCCESS_SNACKBAR = "success";
export const WARNING_SNACKBAR = "warning";
export const ERROR_SNACKBAR = "error";
export const INFO_SNACKBAR = "info";

/* Snackbar Actions */
export const SNACKBAR_ACTION_RETRY = "Retry";

//Network Requests
export const CONTENT_TYPE_JSON = "application/json";
export const CONTENT_TYPE_URL_ENCODED = "application/x-www-form-urlencoded";
export const CONTENT_TYPE_MULTIPART = "multipart/form-data";

/* URLS */
export const HOST_URL = "https://" + window.location.host;
export const LOGOUT_USER_PATH = "/ReceiptOrganizer/logout";
export const LOGIN_PATH = "/ReceiptOrganizer/login?logout";

/* User */
export const USER_THUMBNAIL_PATH =
  "/ReceiptOrganizer/users/image?thumbnail=true";
export const GET_USER_PATH = "/ReceiptOrganizer/users/";

/* Labels */
export const GET_LABELS_PATH = "/ReceiptOrganizer/labels/";
export const ADD_LABEL_PATH = "/ReceiptOrganizer/labels/create";
export const DELETE_LABEL_PATH = "/ReceiptOrganizer/labels/delete";
export const EDIT_LABEL_PATH = "/ReceiptOrganizer/labels/update";

/* Receipts */
export const GET_RECEIPTS_PATH = "/ReceiptOrganizer/receipts/";
export const GET_RECEIPT_THUMBNAIL_PATH =
  "/ReceiptOrganizer/receipts/{0}/thumbnail";
export const GET_RECEIPT_FILE_PATH = "/ReceiptOrganizer/receipts/{0}/file/{1}";
export const CREATE_RECEIPT_PATH = "/ReceiptOrganizer/receipts/create";

//Service Errors
export const SERVER_ERROR = "Unable to reach server";

//Login Error Messages
export const INVALID_USERNAME_MESSAGE = "Username is required";
export const INVALID_PASSWORD_MESSAGE = "Password is required";
