import loadJsonFile from './LoadJsonUtil';

const GetLocaleInfoUtil = {
    get: (responseHandler) => {
        loadJsonFile('./assets/i18nLocales/locales.json', {
            onSuccess: (res) => {
                responseHandler(res);
            },
            onFailure: () => {}
        });
    }
};

export default GetLocaleInfoUtil;
