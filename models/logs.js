var Logs = undefined;

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

// TODO: add analytics method
