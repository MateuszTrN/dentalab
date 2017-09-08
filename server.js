var koa = require('koa');
var send = require('koa-send');
var serve = require('koa-static');
var app = new koa();

app.use(serve('.'));

var port = process.env.PORT || 5000;

app.listen(port);
