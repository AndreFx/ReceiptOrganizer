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
  RECEIVE_QUERY_RECEIPTS,
  REQUEST_RECEIPT_UPLOAD,
  RECEIVE_RECEIPT_UPLOAD,
  REQUEST_RECEIPT_EDIT,
  RECEIVE_RECEIPT_EDIT,
  REQUEST_RECEIPT_PAGE_LOAD,
  RECEIVE_RECEIPT_PAGE_LOAD,
  REQUEST_RECEIPTS_REFRESH,
  RECEIVE_RECEIPTS_REFRESH,
  REQUEST_RECEIPT_DELETE,
  RECEIVE_RECEIPT_DELETE
} from "../actions/receipts/receiptsActions";
import { DEFAULT_PAGINATION_SIZE } from "../../common/constants";

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
    case REQUEST_RECEIPTS_REFRESH:
      return Object.assign({}, state, {
        isFullLoading: true,
        isLoading: true
      });
    case REQUEST_RECEIPT_UPLOAD:
    case REQUEST_RECEIPT_PAGE_LOAD:
    case REQUEST_RECEIPT_EDIT:
    case REQUEST_RECEIPT_DELETE:
      return Object.assign({}, state, {
        isLoading: true
      });
    case RECEIVE_RECEIPT_UPLOAD:
    case RECEIVE_RECEIPT_EDIT:
      if (action.success) {
        return Object.assign({}, state, {
          items: [
            ...state.items.map(function(el) {
              if (el.id === action.id) {
                el = action.receipt;
              }
              return el;
            })
          ],
          totalNumReceipts: state.totalNumReceipts - 1,
          numPages:
            Math.ceil(
              (state.totalNumReceipts - 1) / DEFAULT_PAGINATION_SIZE
            ) === state.numPages
              ? state.numPages
              : state.numPages - 1,
          isLoading: false
        });
      } else {
        return Object.assign({}, state, {
          isLoading: false
        });
      }
    case RECEIVE_RECEIPT_DELETE:
      if (action.success) {
        //TODO: Instead of calculating the new numPages, make new endpoint that returns it
        return Object.assign({}, state, {
          items: [
            ...state.items.filter(function(el) {
              return el.id !== action.id;
            })
          ],
          totalNumReceipts: state.totalNumReceipts - 1,
          numPages:
            Math.ceil(
              (state.totalNumReceipts - 1) / DEFAULT_PAGINATION_SIZE
            ) === state.numPages
              ? state.numPages
              : state.numPages - 1,
          isLoading: false
        });
      } else {
        return Object.assign({}, state, {
          isLoading: false
        });
      }
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
    case RECEIVE_RECEIPTS_REFRESH:
      if (action.success) {
        return Object.assign({}, state, {
          isFullLoading: false,
          isLoading: false,
          items: action.receipts,
          totalNumReceipts: action.numReceipts,
          numPages: action.numPages,
          currentPage: 0
        });
      } else {
        return Object.assign({}, state, {
          isFullLoading: false,
          isLoading: false
        });
      }
    case RECEIVE_RECEIPT_PAGE_LOAD:
      if (action.success) {
        return Object.assign({}, state, {
          isLoading: false,
          items: [...state.items, ...action.receipts],
          currentPage: action.pageNum
        });
      } else {
        return Object.assign({}, state, {
          isLoading: false
        });
      }
    default:
      return state;
  }
}

export default receipts;
