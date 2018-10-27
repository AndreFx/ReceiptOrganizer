import { combineReducers } from 'redux';

//Custom imports
import labels from './labelReducer';
import csrf from './csrfReducer';
import ui from './uiReducer';

export default combineReducers({
    ui,
    csrf,
    labels
});

