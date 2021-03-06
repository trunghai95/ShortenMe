var express = require('express');
var router = express.Router();
var models = undefined;
var config = require('../config');
var utils = require('../utils');

/**
 * Get the database models
 */
exports.configure = function(inputModel) {
    models = inputModel;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    models.getAllUrls(function(err, rows) {
        if (err) {
            return next();
        }

        rows.forEach(function(row) {
            row.shortUrl = require('url').resolve(config.WEBHOST, row.urlCode);
            row.trimmedUrl = utils.trim(row.longUrl);
            row.createdAt = utils.formatDate(row.createdAt);
        });

        res.render('index', {
            title: 'ShortenMe!',
            urls: rows
        });
    });
});

/**
 * Get a short url and redirect to the correct link
 */
router.get('/:urlCode', function(req, res, next) {
    var urlCode = req.params.urlCode;
    models.Urls.getLongUrl(urlCode, function(err, longUrl) {
        if (err || !longUrl) {
            // Cannot find the long url
            return next();
        }

        // Log the hit
        models.Logs.create(urlCode, req.real_ip, req.get('user-agent'), req.get('referrer'), function(err) {
            if (err) {
                console.error('Error: ' + err);
            }
        });

        // Redirect to the long url
        res.redirect(longUrl);
    });
});

/**
 * Get analytics for a shortened url
 */
router.get('/analytics/:urlCode', function(req, res, next) {
    var urlCode = req.params.urlCode;

    // Check if urlCode exists
    models.Urls.getLongUrl(urlCode, function(err, longUrl) {
        if (err || !longUrl) {
            return next();
        }

        models.Logs.getAnalytics(urlCode, function(err, analytics) {
            if (err) {
                return next();
            }

            res.render('analytics', {
                title: 'Analytics | ShortenMe',
                urlCode: urlCode,
                shortUrl: require('url').resolve(config.WEBHOST, urlCode),
                analytics: analytics
            });
        });
    });
});

module.exports.routes = router;
