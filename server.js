var koa = require('koa');
var send = require('koa-send');
var app = new koa();


app.use(async ctx => {
    console.log(ctx.path);
    if (ctx.path === '' || ctx.path === '/') await send(ctx, 'index.html');
    else await send(ctx, ctx.path);
});


app.listen(5000);

console.log('App listening at :5000')