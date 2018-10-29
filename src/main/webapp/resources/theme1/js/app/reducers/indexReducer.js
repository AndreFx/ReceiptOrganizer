import { combineReducers } from 'redux';

//Custom imports
import labels from './labelReducer';
import csrf from './csrfReducer';
import ui from './uiReducer';
import activeLabels from './activeLabelsReducer';

export default combineReducers({
    ui,
    csrf,
    labels,
    activeLabels
});

