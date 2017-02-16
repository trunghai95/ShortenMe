var http = require('http');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var utils = require('./utils');

var index = require('./routes/index');

var models = require('./models/models');
models.connect(function(err) {
        if (err) {
                throw err;
        }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Middleware for parsing the real IP address from the client.
 */
app.use(function(req, res, next) {
        // Set real_ip property to real IP of client if using a reverse proxy (otherwise it will return 127.0.0.1)
        // If not using proxy, it should fall back to req.ip
        req.real_ip = req.header("x-real-ip") || req.ip;
        next();
});

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
});

// error handler
app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
});

module.exports = app;

// Create HTTP server
var server = http.createServer(app);

// Init socket.io
var io = require('socket.io').listen(server);

// Set port for HTTP server
var port = 3000;
app.set('port', port);

// Listen on provided port, on all network interfaces.
server.listen(app.get('port'));
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

io.sockets.on('connection', function(socket) {
    socket.on('shorten', function(longUrl, callback) {
        // TODO: complete this
        callback('Please enter a valid link!');
    });
});
