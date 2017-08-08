var koa = require('koa');
var send = require('koa-send');
var app = new koa();


app.use(async ctx => {
    console.log(ctx.path);
    if (ctx.path === '' || ctx.path === '/') await send(ctx, 'index.html');
    else await send(ctx, ctx.path);
});

var port = process.env.PORT || 5000;

app.listen(port);

console.log('App listening on port: ', port);
