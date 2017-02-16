/**
 * Check the validation of an url
 * Return true if the url is valid and vice versa
 * TODO: Completely check the validation
 */
exports.checkUrl = function(url) {
    return (typeof url == 'string' && url.length > 0);
}
