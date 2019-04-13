import { combineReducers } from "redux";

//Custom imports
import labels from "./labelReducer";
import ui from "./uiReducer";
import activeLabels from "./activeLabelsReducer";
import user from "./userReducer";
import receipts from "./receiptsReducer";
import csrf from "./csrfReducer";

export default combineReducers({
  csrf,
  ui,
  labels,
  activeLabels,
  user,
  receipts
});
