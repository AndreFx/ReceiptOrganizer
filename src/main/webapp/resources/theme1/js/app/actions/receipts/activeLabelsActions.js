//Custom imports
export const REQUEST_ADD_ACTIVE_LABEL = 'REQUEST_ADD_ACTIVE_LABEL';
export const RECEIVE_ADD_ACTIVE_LABEL = 'RECEIVE_ADD_ACTIVE_LABEL';
export const REQUEST_REMOVE_ACTIVE_LABEL = 'REQUEST_REMOVE_ACTIVE_LABEL';
export const RECEIVE_REMOVE_ACTIVE_LABEL = 'RECEIVE_REMOVE_ACTIVE_LABEL';

export function requestAddActiveLabel() {
    return {
        type: REQUEST_ADD_ACTIVE_LABEL
    }
}

export function receiveAddActiveLabel(label, success, msg) {
    return {
        type: RECEIVE_ADD_ACTIVE_LABEL,
        label: label,
        success: success,
        msg: msg
    }
}

export function requestRemoveActiveLabel() {
    return {
        type: REQUEST_REMOVE_ACTIVE_LABEL
    }
}

export function receiveRemoveActiveLabel(label, success, msg) {
    return {
        type: RECEIVE_REMOVE_ACTIVE_LABEL,
        label: label,
        success: success,
        msg: msg
    }
}