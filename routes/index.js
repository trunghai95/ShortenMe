var express = require('express');
var router = express.Router();
var models = undefined;

/**
 * Get the database models
 */
exports.configure = function(inputModel) {
    models = inputModel;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'ShortenMe!' });
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
        console.log(longUrl);

        // Redirect to the long url
        res.redirect(longUrl);
    });
});

module.exports.routes = router;
