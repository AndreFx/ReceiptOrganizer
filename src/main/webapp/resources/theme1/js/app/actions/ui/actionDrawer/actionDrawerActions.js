export const UPDATE_ACTION_DRAWER_VIEW = "UPDATE_ACTION_DRAWER_VIEW";
export const TOGGLE_ACTION_DRAWER = "TOGGLE_ACTION_DRAWER";

export function updateActionDrawerView(view, options) {
  return {
    type: UPDATE_ACTION_DRAWER_VIEW,
    view: view,
    options: options
  };
}

export function toggleActionDrawer(open) {
  return {
    type: TOGGLE_ACTION_DRAWER,
    open: open
  };
}
