export const PROCESS_SNACKBAR_QUEUE = 'PROCESS_SNACKBAR_QUEUE';
export const FINISH_CURRENT_SNACKBAR = 'FINISH_CURRENT_SNACKBAR';
export const ADD_SNACKBAR = 'ADD_SNACKBAR';

export function processSnackbarQueue() {
    return {
        type: PROCESS_SNACKBAR_QUEUE
    }
}

export function finishCurrentSnackbar() {
    return {
        type: FINISH_CURRENT_SNACKBAR
    }
}

export function addSnackbar(newSnackbar) {
    return {
        type: ADD_SNACKBAR,
        newSnackbar: newSnackbar
    }
}