const Koa = require('koa'),
    koaBody = require('koa-body'),
    Router = require('koa-better-router')({prefix: '/wechat-proxy-nodejs'}),
    downstreamFilter = require('./downstream/DownstreamFilter');


let router = Router.loadMethods();
const app = module.exports = new Koa();

// app.use(koaBody());

// Filter
app.use(downstreamFilter({includes: ["/wechat-proxy-nodejs/downstream"]}));

// Routing
require('./downstream/DownstreamControler').registerRoute(router);
require('./monitoring/HealthCheckController').registerRoute(router);


app.use(router.middleware());


module.exports = app;
