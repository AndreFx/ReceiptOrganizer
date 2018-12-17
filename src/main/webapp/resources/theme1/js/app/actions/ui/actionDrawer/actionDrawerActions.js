export const UPDATE_ACTION_DRAWER_VIEW = "UPDATE_ACTION_DRAWER_VIEW";

export function updateActionDrawerView(view) {
  return {
    type: UPDATE_ACTION_DRAWER_VIEW,
    view: view
  };
}
