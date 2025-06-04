import {combineReducers} from 'redux';
import {UPDATE_LOCALE, GETLOCALEINFO_SUCCESS} from '../actions';

// NOTE: We use this type of structure for performance.
const initialState = 'en-US';
const initLocaleInfo = {
    payload: {
        locales: [{code: ''}],
        code: ''
    }
};

function locale (state = initialState, action) {
    if (action.type === UPDATE_LOCALE) {
        return action.payload;
    }
    return state;
}

function localeInfoData (state = initLocaleInfo, action) {
    if (action.type === GETLOCALEINFO_SUCCESS) {
        return Object.assign({}, state, {
            payload: action.payload
        });
    }
    return state;
}

const rootReducer = combineReducers({
    locale,
    localeInfoData
});

export default rootReducer;