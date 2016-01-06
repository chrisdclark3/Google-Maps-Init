var express = require('express');
var app = express();
var port = process.env.PORT || 6789;
var server = require('http').createServer(app);
    server.listen(port);

app.use(express.static('./app/client'));
