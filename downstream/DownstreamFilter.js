const universeUtils = require('../utils/Universe.utils')
    appConfigRepository = require('../univers/AppConfigMemoryRepository'),
    Signature = require('./Signature'),
    logger = require('../utils/logger.utils');


module.exports = filter;


const defaultConfig = {
    includes: [],
    excludes: [],
};

function filter(config) {
    const effectiveConfig = {...defaultConfig, ...config};

    return function (ctx, next) {
        if (!effectiveConfig.includes.find(elt => ctx.path.startsWith(elt))) {
            return next();
        }
        ctx.data = ctx.data || {};

        // Extract universe from host
        const universe = universeUtils.extractUniverseFromHost(ctx.headers.host);
        const appConfigs = appConfigRepository.findByUniverse(universe);

        // Extract wechat config
        const wechatConfig = appConfigs.find(app => app.appName === "wechat");
        if (!wechatConfig) {
            console.log(`No configuration found for universe`, {universe: universe});
            ctx.status = 400;
            return;
        }
        ctx.data.appWechat = wechatConfig;


        // Extract app config
        const appConfig = appConfigs.find(app => app.appName !== "wechat");
        if (!appConfig) {
            logger.error(`No client app found`, {universe: universe});
            ctx.status = 400;
            return;
        }
        ctx.data.appClient = appConfig;

        // Check signature
        const signature = ctx.query.signature;
        const timestamp = ctx.query.timestamp;
        const nonce = ctx.query.nonce;

        const computedSignature = new Signature({timestamp, nonce, token: wechatConfig.secretToken});
        if (!computedSignature.matches(signature)) {
            logger.error(`Signatures are different. expected=${computedSignature.sign()} provided=${signature}`, {universe: universe});
            ctx.status = 403;
            return;
        }

        return next();

    }
}
