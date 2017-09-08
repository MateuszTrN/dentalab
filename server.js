var express = require('express');
var app = new express();

app.use(express.static('.'))

var port = process.env.PORT || 5000;

app.listen(port);
