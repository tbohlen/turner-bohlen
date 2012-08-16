/********************************************************************\
Project: turnerbohlen.com
File: server.js
Description: Main server file for turnerbohlen.com
Author: Turner Bohlen (www.turnerbohlen.com)
Created: 08/14/2012
Copyright 2012 Turner Bohlen
\********************************************************************/

var express = require('express')
    , app = express.createServer();
// use html pages with render
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
//configure app
app.configure(function() {
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: '[pnuib;lkjhgf87sofgagfa' }));
    app.use(function(req, res, next) {
        var setHeader = res.setHeader;
        res.setHeader = function(name) {
            switch (name) {
                case 'Cache-Control':
                    case 'Last-Modified':
                    case 'ETag':
                    return;
            }
            return setHeader.apply(res, arguments);
        };
        next();
    });
    //app.use(express.favicon(__dirname + '/../static/favicon.ico'));
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

// run the app!
app.listen(8080);
