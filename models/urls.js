var config = require('../config');
var jsesc = require('jsesc');
var Urls = undefined;

/**
 * Get the sequelize model
 */
exports.configure = function(inputModel) {
    Urls = inputModel;
}

/**
 * Generate a random code
 * Get the code length and charset from config file
 */
function generateRandomCode() {
    var length = config.CODE_LENGTH;
    var charsetLength = config.CHARSET.length;
    var code = '';

    while (length > 0) {
        code += config.CHARSET[Math.floor(Math.random() * charsetLength)];
        --length;
    }

    return code;
}

/**
 * Generate a unique url code and send the code through callback function
 */
function generateUniqueCode(callback) {
    var tryUrl = function(code) {
        // Get a random code and check if it exists in db or not
        Urls.find({
            where: {
                urlCode: jsesc(code)
            }
        }).then(function(url) {
            if (url) {
                // If the code already exists, try another code
                tryUrl(generateRandomCode());
            } else {
                callback(null, code);
            }
        }).error(function(err) {
            callback(err);
        });
    }
    
    tryUrl(generateRandomCode());
}

/**
 * Create a new url
 */
exports.create = function(longUrl, callback) {
    // Get a unique url code
    generateUniqueCode(function(err, urlCode) {
        if (err) {
            return callback(err);
        }

        // Add new entry to table
        Urls.create({
            urlCode: urlCode,
            longUrl: jsesc(longUrl)
        }).then(function(url) {
            callback(null, {
                urlCode: url.urlCode,
                longUrl: url.longUrl
            });
        }).error(function(err) {
            callback(err);
        });
    });
}

/**
 * Get long Url from url code
 */
exports.getLongUrl = function(urlCode, callback) {
    Urls.find({
        where: {
            urlCode: jsesc(urlCode)
        }
    }).then(function(url) {
        if (url) {
            callback(null, url.longUrl);
        } else {
            callback(null, null);
        }
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Get url code from long url
 */
exports.getUrlCode = function(longUrl, callback) {
    Urls.find({
        where: {
            longUrl: jsesc(longUrl)
        }
    }).then(function(url) {
        if (url) {
            callback(null, url.urlCode);
        } else {
            // If the url does not exist, add it to db
            exports.create(longUrl, function(err, url) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, url.urlCode);
                }
            })
        }
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Get all urls from database
 */
exports.getAllUrls = function(callback) {
    var list = [];
    Urls.findAll().then(function(rows) {
        rows.forEach(function(row) {
            list.append({
                urlCode: row.urlCode,
                longUrl: row.longUrl
            });
        });

        callback(null, list);
    }).error(function(err) {
        callback(err);
    })
}
