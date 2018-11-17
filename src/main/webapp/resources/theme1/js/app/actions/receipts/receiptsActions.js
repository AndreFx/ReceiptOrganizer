//Custom imports
import {
  GET_RECEIPTS_PATH,
  SERVER_ERROR,
  ERROR_SNACKBAR,
  SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
  HOST_URL
} from "../../../common/constants";
import {
  requestAddActiveLabel,
  requestRemoveActiveLabel,
  receiveAddActiveLabel,
  receiveRemoveActiveLabel,
  requestEditActiveLabel,
  receiveEditActiveLabel
} from "./activeLabelsActions";
import { addSnackbar } from "../ui/snackbar/snackbarActions";
import fetchService from "../../../common/utils/fetchService";

export const REQUEST_QUERY_RECEIPTS = "REQUEST_QUERY_RECEIPTS";
export const RECEIVE_QUERY_RECEIPTS = "RECEIVE_QUERY_RECEIPTS";
export const REQUEST_RECEIPT_PAGE_CHANGE = "REQUEST_RECEIPT_PAGE_CHANGE";
export const RECEIVE_RECEIPT_PAGE_CHANGE = "RECEIVE_RECEIPT_PAGE_CHANGE";

const errorSnackbar = {
  msg: SERVER_ERROR,
  variant: ERROR_SNACKBAR,
  actions: [],
  handlers: [],
  handlerParams: [],
  autohideDuration: SNACKBAR_AUTOHIDE_DURATION_DEFAULT
};

export function requestQueryReceipts() {
  return {
    type: REQUEST_QUERY_RECEIPTS
  };
}

export function receiveQueryReceipts(
  query,
  receipts,
  numReceipts,
  numPages,
  success
) {
  return {
    type: RECEIVE_QUERY_RECEIPTS,
    receipts: receipts,
    query: query,
    numPages: numPages,
    numReceipts: numReceipts,
    success: success
  };
}

export function queryReceipts(query) {
  return function(dispatch, getState) {
    const { activeLabels } = getState();
    let url = new URL(HOST_URL + GET_RECEIPTS_PATH);

    let params = {
      query: query,
      activeLabelNames: [
        ...activeLabels.items.map(function(el) {
          return el.name;
        })
      ],
      pageNum: 0
    };

    dispatch(requestQueryReceipts());

    //Create full url
    url = fetchService.encodeURLParams(url, params);
    return fetchService
      .doFetch(url)
      .then(function(response) {
        fetchService.checkResponseStatus(response);
        return response.json();
      })
      .then(function(json) {
        dispatch(
          receiveQueryReceipts(
            query,
            json.receipts,
            json.totalNumReceipts,
            json.numPages,
            json.success
          )
        );

        return Promise.resolve(json.success);
      })
      .catch(function(error) {
        dispatch(receiveQueryReceipts(query, [], 0, 0, false));
        dispatch(addSnackbar(errorSnackbar));
        return Promise.resolve(false);
      });
  };
}

export function requestReceiptPageChange() {
  return {
    type: REQUEST_RECEIPT_PAGE_CHANGE
  };
}

export function receiveReceiptPageChange(pageNum, receipts, success) {
  return {
    type: RECEIVE_RECEIPT_PAGE_CHANGE,
    receipts: receipts,
    pageNum: pageNum,
    success: success
  };
}

export function changeReceiptPage(pageNum) {
  return function(dispatch, getState) {
    const { activeLabels, receipts } = getState();
    let url = new URL(HOST_URL + GET_RECEIPTS_PATH);
    let params = {
      pageNum: pageNum,
      query: receipts.pageNum,
      activeLabelNames: [
        ...activeLabels.items.map(function(el) {
          return el.name;
        })
      ]
    };

    //Dispatch appropriate action
    dispatch(requestReceiptPageChange());

    //Create full url
    url = fetchService.encodeURLParams(url, params);
    return fetchService
      .doFetch(url)
      .then(function(response) {
        fetchService.checkResponseStatus(response);
        return response.json();
      })
      .then(function(json) {
        dispatch(
          receiveReceiptPageChange(json.pageNum, json.receipts, json.success)
        );

        return Promise.resolve(json.success);
      })
      .catch(function(error) {
        dispatch(receiveReceiptPageChange(pageNum, [], false));
        dispatch(addSnackbar(errorSnackbar));
        return Promise.resolve(false);
      });
  };
}

export function addActiveLabel(label) {
  return function(dispatch, getState) {
    const { activeLabels, receipts } = getState();
    let url = new URL(HOST_URL + GET_RECEIPTS_PATH);
    let params = {
      activeLabelNames: [
        ...activeLabels.items.map(function(el) {
          return el.name;
        }),
        label.name
      ],
      query: receipts.query,
      pageNum: 0
    };

    //Dispatch appropriate action
    dispatch(requestAddActiveLabel());

    //Create full url
    url = fetchService.encodeURLParams(url, params);
    return fetchService
      .doFetch(url)
      .then(function(response) {
        fetchService.checkResponseStatus(response);
        return response.json();
      })
      .then(function(json) {
        dispatch(
          receiveAddActiveLabel(
            label,
            json.receipts,
            json.totalNumReceipts,
            json.numPages,
            json.success
          )
        );

        return Promise.resolve(json.success);
      })
      .catch(function(error) {
        dispatch(receiveAddActiveLabel(label, [], 0, 0, false));
        dispatch(addSnackbar(errorSnackbar));
        return Promise.resolve(false);
      });
  };
}

export function editActiveLabel(oldLabel, newLabel) {
  return function(dispatch, getState) {
    const { activeLabels, receipts } = getState();
    let url = new URL(HOST_URL + GET_RECEIPTS_PATH);
    let params = {
      pageNum: 0,
      activeLabelNames: [
        ...activeLabels.items.map(function(el, ind, arr) {
          return el.name === oldLabel.name ? newLabel.name : el.name;
        })
      ],
      query: receipts.query
    };

    //Dispatch appropriate action
    dispatch(requestEditActiveLabel());

    //Create full url
    url = fetchService.encodeURLParams(url, params);
    return fetchService
      .doFetch(url)
      .then(function(response) {
        fetchService.checkResponseStatus(response);
        return response.json();
      })
      .then(function(json) {
        dispatch(receiveEditActiveLabel(newLabel, oldLabel, json.success));

        return Promise.resolve(json.success);
      })
      .catch(function(error) {
        dispatch(receiveEditActiveLabel(newLabel, oldLabel, false));
        dispatch(addSnackbar(errorSnackbar));
        return Promise.resolve(false);
      });
  };
}

export function removeActiveLabel(label) {
  return function(dispatch, getState) {
    const { activeLabels, receipts } = getState();
    let url = new URL(HOST_URL + GET_RECEIPTS_PATH);
    let params = {
      activeLabelNames: [
        ...activeLabels.items
          .map(function(el) {
            return el.name;
          })
          .filter(function(name, ind, arr) {
            return name !== label.name;
          })
      ],
      query: receipts.query,
      pageNum: 0
    };

    //Dispatch appropriate action
    dispatch(requestRemoveActiveLabel());

    //Create full url
    url = fetchService.encodeURLParams(url, params);
    return fetchService
      .doFetch(url)
      .then(function(response) {
        fetchService.checkResponseStatus(response);
        return response.json();
      })
      .then(function(json) {
        dispatch(
          receiveRemoveActiveLabel(
            label,
            json.receipts,
            json.totalNumReceipts,
            json.numPages,
            json.success
          )
        );

        return Promise.resolve(json.success);
      })
      .catch(function(error) {
        dispatch(receiveRemoveActiveLabel(label, [], 0, 0, false));
        dispatch(addSnackbar(errorSnackbar));
        return Promise.resolve(false);
      });
  };
}
