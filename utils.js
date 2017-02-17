const URL_PATTERN = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

/**
 * Add http to the url if it does not have protocol
 */
exports.addHttp = function(url) {
    if (typeof url !== 'string') {
        return url;
    }
    
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
}

/**
 * Check the validation of an url
 * Return null if the url is not valid
 */
exports.checkUrl = function(url) {
    if (typeof url !== 'string' || url.length <= 0) {
        return null;
    }

    return url.match(URL_PATTERN);
}
