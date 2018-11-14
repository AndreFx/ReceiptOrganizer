//Custom imports
import {
  RECEIVE_ADD_ACTIVE_LABEL,
  RECEIVE_REMOVE_ACTIVE_LABEL,
  RECEIVE_EDIT_ACTIVE_LABEL
} from "../actions/receipts/activeLabelsActions";

export const ACTIVE_LABELS_INITIAL_STATE = {
  items: []
};

function activeLabels(state = ACTIVE_LABELS_INITIAL_STATE, action) {
  switch (action.type) {
    case RECEIVE_ADD_ACTIVE_LABEL:
      if (action.success) {
        return Object.assign({}, state, {
          items: [...state.items, action.label]
        });
      } else {
        return state;
      }
    case RECEIVE_REMOVE_ACTIVE_LABEL:
      if (action.success) {
        return Object.assign({}, state, {
          items: [
            ...state.items.filter(function(el, ind, arr) {
              return el.name !== action.label.name;
            })
          ]
        });
      } else {
        return state;
      }
    case RECEIVE_EDIT_ACTIVE_LABEL:
      if (action.success) {
        return Object.assign({}, state, {
          items: [
            ...state.items.map(function(value, index, arr) {
              return value.name === action.oldLabel.name
                ? action.newLabel
                : value;
            })
          ]
        });
      } else {
        return state;
      }
    default:
      return state;
  }
}

export default activeLabels;
