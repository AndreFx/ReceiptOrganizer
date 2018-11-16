import { combineReducers } from "redux";

//Custom imports
import labels from "./labelReducer";
import ui from "./uiReducer";
import activeLabels from "./activeLabelsReducer";
import user from "./userReducer";
import receipts from "./receiptsReducer";

export default combineReducers({
  ui,
  labels,
  activeLabels,
  user,
  receipts
});
