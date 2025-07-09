import GetLocaleInfoUtil from './GetLocaleInfo';

export const UPDATE_LOCALE = 'UPDATE_LOCALE';
export const GETLOCALEINFO_SUCCESS = 'GETLOCALEINFO_SUCCESS';

export const updateLocale = locale => {
    return {
        type: UPDATE_LOCALE,
        payload: locale
    };
};

export const requestLocaleInfo = () => (dispatch) => {
    return GetLocaleInfoUtil.get(res => {
        dispatch({
            type: GETLOCALEINFO_SUCCESS,
            payload: res
        });
    });
};