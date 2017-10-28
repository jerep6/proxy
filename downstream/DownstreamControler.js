const got = require('got'),
    Signature = require('./Signature'),
    _ = require('lodash'),
    logger = require('../utils/logger.utils');

module.exports = {
    registerRoute
};

function registerRoute(router) {
    router.post('/downstream(.*)', forwardToApplication);
}


function forwardToApplication(ctx, next) {

    // Generate signature with the client secret token
    const signature = new Signature({token: ctx.data.appClient.secretToken});
    const queryParams = ctx.query;

    queryParams.signature = signature.sign();
    queryParams.timestamp = signature.timestamp;
    queryParams.nonce = signature.nonce;

    const filteredHeaders = _.pickBy(ctx.headers, (value, key) => {
        if (key === "host")
          return false;
        if (key.startsWith('X-Amzn'))
            return false;
        if (key.startsWith('X-Forwarded-Proto'))
            return false;

        return true;
    });

    const clientPath = (ctx.path || '').split('/')[3] || '';
    const url = `${ctx.data.appWechat.appUrl}/${clientPath}`;

    const options = {
        query: queryParams,
        headers: filteredHeaders,
        // timeout: {connect: 1000, socket: 10000, request: 10000},
        timeout: {connect: 1000, socket: 5000, request: 10000}
    };

    logger.debug('Call downstream', options);

    // TODO : renvoyer un code HTTP 504 si le serveur distant met trop de temps à répondre
    // TODO : renvoyer un code HTTP 500 si une inconnue se produit
    const stream = ctx.req.pipe(got.stream
        .post(url, options));
    ctx.body = stream;
}
