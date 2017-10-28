
const mockHost = process.env.MOCK_URL || 'http://localhost:3000';

const appConfigs = [
    {
        "appId": "wechatappid",
        "appName": "wechat",
        "appSecret": "wechatappsecret",
        "appUrl": `${mockHost}/clientapp`,
        "secretToken": "wechatsecrettoken",
        "universe": "bench",
        "tokens": [
            {
                "access_token": "2f68da5d-d721-4270-8701-90b96264354d",
                "expire_date": "2018-10-09T18:06:15.436Z",
                "expires_in": 7200
            }
        ]
    },
    {
        "appId": "proxyappid",
        "appName": "ben-app",
        "appSecret": "proxyappsecret",
        "appUrl": `${mockHost}/clientapp`,
        "secretToken": "proxysecrettoken",
        "universe": "bench",
        "tokens": [
            {
                "access_token": "2f68da5d-d721-4270-8701-90b96264354d",
                "expire_date": "2018-10-09T18:06:15.436Z",
                "expires_in": 7200
            }
        ]
    }
];


module.exports = {
    findByUniverse,
    getByUniverseAndAppName
}

function getByUniverseAndAppName(universeName, appName) {
    return appConfigs
        .filter(app => app.universe === universeName)
        .find(app => app.appName === appName);
}

function findByUniverse(universeName) {
    return appConfigs.filter(app => app.universe === universeName);
}


