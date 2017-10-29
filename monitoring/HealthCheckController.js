
module.exports = {
    registerRoute
};

function registerRoute(router) {
    router.get('/application/health', healthCheck);
}


function healthCheck (ctx, next) {
    ctx.body = {status: "alive"}
}
