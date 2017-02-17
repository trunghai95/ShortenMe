const URL_PATTERN = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)\/?$/;

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
 * Return true if the url is valid and vice versa
 */
exports.checkUrl = function(url) {
    if (typeof url !== 'string' || url.length <= 0) {
        return null;
    }

    return URL_PATTERN.test(url);
}

/**
 * Trim an url to at most 50 characters
 */
exports.trim = function(url) {
    var maxLen = 70;
    if (typeof url !== 'string' || url.length <= maxLen) {
        return url;
    }

    return url.substr(0, maxLen-2) + '...';
}

/**
 * Format a date object to string "M d, y"
 */
exports.formatDate = function(date) {
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
            'August', 'September', 'November', 'December'];

    return monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}
