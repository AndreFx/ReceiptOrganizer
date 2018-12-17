export const UPDATE_CONTENT_VIEW = "UPDATE_CONTENT_VIEW";

export function updateContentView(view) {
  return {
    type: UPDATE_CONTENT_VIEW,
    view: view
  };
}
