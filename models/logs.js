var Logs = undefined;
var Sequelize = require('sequelize');

const DAY_LENGTH = 24 * 60 * 60 * 1000;

/**
 * Get the sequelize model
 */
exports.configure = function(inputModel) {
    Logs = inputModel;
}

/**
 * Create a new log entry
 */
exports.create = function(urlCode, ipAddress, userAgent, referral, callback) {
    if (!referral) {
        referral = 'Others';
    }

    Logs.create({
        urlCode: urlCode,
        ipAddress: ipAddress,
        userAgent: userAgent,
        referral: referral
    }).then(function(log) {
        callback(null);
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Get total hits for a urlCode
 */
function getTotalHits(urlCode, callback) {
    Logs.count({
        where: { urlCode: urlCode }
    }).then(function(count) {
        callback(null, count);
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Get referral sources with respective hit counts
 */
function getReferralSources(urlCode, callback) {
    Logs.findAll({
        where: { urlCode: urlCode },
        group: ['referral'],
        attributes: ['referral', [Sequelize.fn('count', Sequelize.col('referral')), 'hits']],
        order: [ [Sequelize.col('hits'), 'DESC'] ],
        raw: true
    }).then(function(rows) {
        var list = [];
        rows.forEach(function(row) {
            list.push({
                referral: row.referral,
                hits: row.hits
            });
        });
        callback(null, list);
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Get daily hits count for the last 30 days
 */
function getDailyHits(urlCode, callback) {
    var dayCount = 30;

    Logs.count({
        where: {
            urlCode: urlCode,
            createdAt: {
                $gt: new Date(new Date() - dayCount * DAY_LENGTH)
            }
        }
    }).then(function(count) {
        callback(null, count / dayCount);
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Get weekly hits count for the last 4 weeks
 */
function getWeeklyHits(urlCode, callback) {
    var weekCount = 4;

    Logs.count({
        where: {
            urlCode: urlCode,
            createdAt: {
                $gt: new Date(new Date() - weekCount * 7 * DAY_LENGTH)
            }
        }
    }).then(function(count) {
        callback(null, count / weekCount);
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Get the analytics for a url code:
 * - totalHits: Total number of hits
 * - referralSources: Total hit by referral source
 * - dailyHits: Daily hits for the last 30 days
 * - weeklyHits: Weekly hits for the last 4 weeks
 */
exports.getAnalytics = function(urlCode, callback) {
    var result = {}

    getTotalHits(urlCode, function(err, count) {
        if (err) {
            return callback(err);
        }
        result.totalHits = count;

        getReferralSources(urlCode, function(err, list) {
            if (err) {
                return callback(err);
            }
            result.referralSources = list;

            getDailyHits(urlCode, function(err, count) {
                if (err) {
                    return callback(err);
                }
                result.dailyHits = count;

                getWeeklyHits(urlCode, function(err, count) {
                    if (err) {
                        return callback(err);
                    }
                    result.weeklyHits = count;

                    callback(null, result);
                });
            });
        });
    });
}
