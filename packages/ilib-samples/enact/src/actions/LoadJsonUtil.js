const loadJsonFile = (url, {onSuccess, onFailure}) => {
    if (typeof window === 'object') {
        const xhr = new window.XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    onSuccess(JSON.parse(xhr.response));
                } else {
                    onFailure();
                }
            }
        };
        xhr.send();
    }
};

export default loadJsonFile;