//Custom imports
import {
  GET_RECEIPTS_PATH,
  SERVER_ERROR,
  ERROR_SNACKBAR,
  SNACKBAR_AUTOHIDE_DURATION_DEFAULT,
  HOST_URL,
  CONTENT_TYPE_JSON,
  CREATE_RECEIPT_PATH,
  EDIT_RECEIPT_PATH,
  DELETE_RECEIPT_PATH,
  CURRENCY_FIXED_DECIMAL
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
export const REQUEST_RECEIPT_PAGE_LOAD = "REQUEST_RECEIPT_PAGE_LOAD";
export const RECEIVE_RECEIPT_PAGE_LOAD = "RECEIVE_RECEIPT_PAGE_LOAD";
export const REQUEST_RECEIPT_UPLOAD = "REQUEST_RECEIPT_UPLOAD";
export const RECEIVE_RECEIPT_UPLOAD = "RECEIVE_RECEIPT_UPLOAD";
export const REQUEST_RECEIPT_EDIT = "REQUEST_RECEIPT_EDIT";
export const RECEIVE_RECEIPT_EDIT = "RECEIVE_RECEIPT_EDIT";
export const REQUEST_RECEIPT_DELETE = "REQUEST_RECEIPT_DELETE";
export const RECEIVE_RECEIPT_DELETE = "RECEIVE_RECEIPT_DELETE";
export const REQUEST_RECEIPTS_REFRESH = "REQUEST_RECEIPTS_REFRESH";
export const RECEIVE_RECEIPTS_REFRESH = "RECEIVE_RECEIPTS_REFRESH";

const errorSnackbar = {
  msg: SERVER_ERROR,
  variant: ERROR_SNACKBAR,
  actions: [],
  handlers: [],
  handlerParams: [],
  autohideDuration: SNACKBAR_AUTOHIDE_DURATION_DEFAULT
};

export function formatReceipt(receipt) {
  return {
    ...receipt,
    labels: receipt.labels ? receipt.labels : [],
    items: receipt.items.map(function(el) {
      return {
        ...el,
        unitPrice: Number.parseFloat(el.unitPrice).toFixed(
          CURRENCY_FIXED_DECIMAL
        ),
        warrantyUnit: el.warrantyUnit ? el.warrantyUnit : "d"
      };
    }),
    total: Number.parseFloat(receipt.total).toFixed(CURRENCY_FIXED_DECIMAL),
    tax: Number.parseFloat(receipt.tax).toFixed(CURRENCY_FIXED_DECIMAL),
    title: receipt.title ? receipt.title : "",
    description: receipt.description ? receipt.description : "",
    date: receipt.date ? receipt.date : new Date(),
    vendor: receipt.vendor ? receipt.vendor : ""
  };
}

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
        const receipts = json.receipts.map(function(el) {
          return formatReceipt(el);
        });
        dispatch(
          receiveQueryReceipts(
            query,
            receipts,
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

export function requestReceiptsRefresh() {
  return {
    type: REQUEST_RECEIPTS_REFRESH
  };
}

export function receiveReceiptsRefresh(
  receipts,
  numReceipts,
  numPages,
  success
) {
  return {
    type: RECEIVE_RECEIPTS_REFRESH,
    receipts: receipts,
    numPages: numPages,
    numReceipts: numReceipts,
    success: success
  };
}

export function refreshReceipts() {
  return function(dispatch, getState) {
    const { activeLabels, receipts } = getState();
    let url = new URL(HOST_URL + GET_RECEIPTS_PATH);

    let params = {
      query: receipts.query,
      activeLabelNames: [
        ...activeLabels.items.map(function(el) {
          return el.name;
        })
      ],
      pageNum: 0
    };

    dispatch(requestReceiptsRefresh());

    //Create full url
    url = fetchService.encodeURLParams(url, params);
    return fetchService
      .doFetch(url)
      .then(function(response) {
        fetchService.checkResponseStatus(response);
        return response.json();
      })
      .then(function(json) {
        const receipts = json.receipts.map(function(el) {
          return formatReceipt(el);
        });
        dispatch(
          receiveReceiptsRefresh(
            receipts,
            json.totalNumReceipts,
            json.numPages,
            json.success
          )
        );

        return Promise.resolve(json.success);
      })
      .catch(function(error) {
        dispatch(receiveReceiptsRefresh([], 0, 0, false));
        dispatch(addSnackbar(errorSnackbar));
        return Promise.resolve(false);
      });
  };
}

export function requestReceiptPageLoad() {
  return {
    type: REQUEST_RECEIPT_PAGE_LOAD
  };
}

export function receiveReceiptPageLoad(pageNum, receipts, success) {
  return {
    type: RECEIVE_RECEIPT_PAGE_LOAD,
    receipts: receipts,
    pageNum: pageNum,
    success: success
  };
}

export function loadReceiptPage(pageNum) {
  return function(dispatch, getState) {
    const { activeLabels, receipts } = getState();
    let url = new URL(HOST_URL + GET_RECEIPTS_PATH);
    let params = {
      pageNum: pageNum,
      query: receipts.query,
      activeLabelNames: [
        ...activeLabels.items.map(function(el) {
          return el.name;
        })
      ]
    };

    //Dispatch appropriate action
    dispatch(requestReceiptPageLoad());

    //Create full url
    url = fetchService.encodeURLParams(url, params);
    return fetchService
      .doFetch(url)
      .then(function(response) {
        fetchService.checkResponseStatus(response);
        return response.json();
      })
      .then(function(json) {
        const receipts = json.receipts.map(function(el) {
          return formatReceipt(el);
        });
        dispatch(receiveReceiptPageLoad(pageNum, receipts, json.success));

        return Promise.resolve(json.success);
      })
      .catch(function(error) {
        dispatch(receiveReceiptPageLoad(pageNum, [], false));
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
        const receipts = json.receipts.map(function(el) {
          return formatReceipt(el);
        });
        dispatch(
          receiveAddActiveLabel(
            label,
            receipts,
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
        const receipts = json.receipts.map(function(el) {
          return formatReceipt(el);
        });
        dispatch(
          receiveRemoveActiveLabel(
            label,
            receipts,
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

export function requestReceiptUpload() {
  return {
    type: REQUEST_RECEIPT_UPLOAD
  };
}

export function receiveReceiptUpload(success) {
  return {
    type: RECEIVE_RECEIPT_UPLOAD,
    success: success
  };
}

export function uploadReceipt(skipOcr, receiptFile) {
  return function(dispatch, getState) {
    const state = getState();
    const csrfHeaderName = state.csrf.csrfheadername;
    const csrfToken = state.csrf.csrftoken;
    let url = new URL(HOST_URL + CREATE_RECEIPT_PATH);
    let formData = new FormData();
    formData.append("skipOcr", skipOcr);
    formData.append("receiptFile", receiptFile);

    //Dispatch appropriate action
    dispatch(requestReceiptUpload());

    return fetchService
      .doFetch(url, {
        method: "post",
        headers: {
          Accept: CONTENT_TYPE_JSON,
          [csrfHeaderName]: csrfToken
        },
        body: formData
      })
      .then(function(response) {
        fetchService.checkResponseStatus(response);
        return response.json();
      })
      .then(function(json) {
        dispatch(receiveReceiptUpload(json.success));

        return Promise.resolve(json);
      })
      .catch(function(error) {
        dispatch(receiveReceiptUpload(false));
        dispatch(addSnackbar(errorSnackbar));
        return Promise.reject();
      });
  };
}

export function requestEditReceipt() {
  return {
    type: REQUEST_RECEIPT_EDIT
  };
}

export function receiveEditReceipt(id, receipt, success) {
  return {
    type: RECEIVE_RECEIPT_EDIT,
    id: id,
    receipt: receipt,
    success: success
  };
}

export function editReceipt(updatedReceipt) {
  return function(dispatch, getState) {
    const state = getState();
    const csrfHeaderName = state.csrf.csrfheadername;
    const csrfToken = state.csrf.csrftoken;
    let url = new URL(HOST_URL + EDIT_RECEIPT_PATH.format(updatedReceipt.id));

    //Dispatch appropriate action
    dispatch(requestEditReceipt());

    return fetchService
      .doFetch(url, {
        method: "post",
        headers: {
          Accept: CONTENT_TYPE_JSON,
          "Content-Type": CONTENT_TYPE_JSON,
          [csrfHeaderName]: csrfToken
        },
        body: JSON.stringify(updatedReceipt)
      })
      .then(function(response) {
        fetchService.checkResponseStatus(response);
        return response.json();
      })
      .then(function(json) {
        dispatch(
          receiveEditReceipt(json.receipt.id, json.receipt, json.success)
        );

        return Promise.resolve(json);
      })
      .catch(function(error) {
        dispatch(receiveEditReceipt(updatedReceipt.id, null, false));
        dispatch(addSnackbar(errorSnackbar));
        return Promise.reject();
      });
  };
}

export function requestDeleteReceipt() {
  return {
    type: REQUEST_RECEIPT_DELETE
  };
}

export function receiveDeleteReceipt(id, success) {
  return {
    type: RECEIVE_RECEIPT_DELETE,
    id: id,
    success: success
  };
}

export function deleteReceipt(id) {
  return function(dispatch, getState) {
    const state = getState();
    const csrfHeaderName = state.csrf.csrfheadername;
    const csrfToken = state.csrf.csrftoken;
    let url = new URL(HOST_URL + DELETE_RECEIPT_PATH.format(id));

    //Dispatch appropriate action
    dispatch(requestDeleteReceipt());

    return fetchService
      .doFetch(url, {
        method: "post",
        headers: {
          Accept: CONTENT_TYPE_JSON,
          "Content-Type": CONTENT_TYPE_JSON,
          [csrfHeaderName]: csrfToken
        }
      })
      .then(function(response) {
        fetchService.checkResponseStatus(response);
        return response.json();
      })
      .then(function(json) {
        dispatch(receiveDeleteReceipt(id, json.success));

        return Promise.resolve(json);
      })
      .catch(function(error) {
        dispatch(receiveDeleteReceipt(id, false));
        dispatch(addSnackbar(errorSnackbar));
        return Promise.reject();
      });
  };
}
