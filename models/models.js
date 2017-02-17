var Sequelize = require('sequelize');
var config = require('../config');

var urls = require('./urls');
var logs = require('./logs');

var Urls = undefined;
var Logs = undefined;

/**
 * Connect to the database and define the models
 */
exports.connect = function(callback) {
    var sqlz = new Sequelize(config.DB_URI);

    // Create Url model
    Urls = sqlz.define('Url', {
        urlCode: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        longUrl: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    Urls.sync().then(function() {
        // Url model created successfully
        urls.configure(Urls);
        exports.Urls = urls;

        // Create Log model
        Logs = sqlz.define('Log', {
            ipAddress: Sequelize.STRING,
            userAgent: Sequelize.STRING,
            referral: Sequelize.STRING
        });

        // Create relationship between models
        // ON DELETE CASCADE --> If a url is deleted, the log referencing to 
        // that url will also be deleted.
        Logs.belongsTo(Urls, {
            foreignKey: 'urlCode',
            onDelete: 'CASCADE'
        });
        Urls.hasMany(Logs, {
            foreignKey: 'urlCode',
            onDelete: 'CASCADE'
        });

        Logs.sync().then(function() {
            // Log model created successfully
            logs.configure(Logs);
            exports.Logs = logs;

            callback();
        }).error(function(err) {
            // Error when creating Log model
            callback(err);
        });

    }).error(function(err) {
        // Error when creating Url model
        callback(err);
    });
}

/**
 * Get all urls in database
 * Returned columns: urlCode, longUrl, totalHits
 */
exports.getAllUrls = function(callback) {
    var list = [];

    Urls.findAll({
        include: [{
            model: Logs
        }],
        order: [ ['createdAt', 'DESC'] ]
    }).then(function(rows) {
        rows.forEach(function(row) {
            list.push({
                urlCode: row.urlCode,
                longUrl: row.longUrl,
                createdAt: row.createdAt,
                totalHits: row.Logs.length
            });
        });

        callback(null, list);
    }).error(function(err) {
        callback(err);
    });
}
