//Custom imports
import {
  REQUEST_ADD_ACTIVE_LABEL,
  RECEIVE_ADD_ACTIVE_LABEL,
  RECEIVE_REMOVE_ACTIVE_LABEL,
  REQUEST_REMOVE_ACTIVE_LABEL,
  REQUEST_EDIT_ACTIVE_LABEL,
  RECEIVE_EDIT_ACTIVE_LABEL
} from "../actions/receipts/activeLabelsActions";
import {
  REQUEST_QUERY_RECEIPTS,
  REQUEST_RECEIPT_PAGE_CHANGE,
  RECEIVE_QUERY_RECEIPTS,
  RECEIVE_RECEIPT_PAGE_CHANGE,
  REQUEST_RECEIPT_UPLOAD,
  RECEIVE_RECEIPT_UPLOAD
} from "../actions/receipts/receiptsActions";

export const RECEIPTS_INITIAL_STATE = {
  isLoading: false,
  isFullLoading: false,
  items: [],
  currentPage: 0,
  numPages: 0,
  totalNumReceipts: 0,
  query: ""
};

function receipts(state = RECEIPTS_INITIAL_STATE, action) {
  switch (action.type) {
    case REQUEST_ADD_ACTIVE_LABEL:
    case REQUEST_REMOVE_ACTIVE_LABEL:
    case REQUEST_EDIT_ACTIVE_LABEL:
    case REQUEST_QUERY_RECEIPTS:
    case REQUEST_RECEIPT_PAGE_CHANGE:
      return Object.assign({}, state, {
        isFullLoading: true,
        isLoading: true
      });
    case REQUEST_RECEIPT_UPLOAD:
      return Object.assign({}, state, {
        isLoading: true
      });
    case RECEIVE_RECEIPT_UPLOAD:
      return Object.assign({}, state, {
        isLoading: false
      });
    case RECEIVE_ADD_ACTIVE_LABEL:
    case RECEIVE_REMOVE_ACTIVE_LABEL:
      if (action.success) {
        return Object.assign({}, state, {
          isFullLoading: false,
          isLoading: false,
          items: action.receipts,
          numPages: action.numPages,
          totalNumReceipts: action.numReceipts,
          currentPage: 0
        });
      } else {
        return Object.assign({}, state, {
          isFullLoading: false,
          isLoading: false
        });
      }
    case RECEIVE_EDIT_ACTIVE_LABEL:
      return Object.assign({}, state, {
        isFullLoading: false,
        isLoading: false
      });
    case RECEIVE_QUERY_RECEIPTS:
      if (action.success) {
        return Object.assign({}, state, {
          isFullLoading: false,
          isLoading: false,
          items: action.receipts,
          totalNumReceipts: action.numReceipts,
          numPages: action.numPages,
          currentPage: 0,
          query: action.query
        });
      } else {
        return Object.assign({}, state, {
          isFullLoading: false,
          isLoading: false
        });
      }
    case RECEIVE_RECEIPT_PAGE_CHANGE:
      if (action.success) {
        return Object.assign({}, state, {
          isFullLoading: false,
          isLoading: false,
          items: action.receipts,
          currentPage: action.pageNum
        });
      } else {
        return Object.assign({}, state, {
          isFullLoading: false,
          isLoading: false
        });
      }
    default:
      return state;
  }
}

export default receipts;
