export const CLOSE_DIALOG = "CLOSE_DIALOG";
export const OPEN_DIALOG = "OPEN_DIALOG";

export function closeDialog() {
  return {
    type: CLOSE_DIALOG
  };
}

export function openDialog(title, submit, close, options) {
  return {
    type: OPEN_DIALOG,
    title: title,
    submit: submit,
    close: close,
    options: options
  };
}
