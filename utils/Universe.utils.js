module.exports = {
    extractUniverseFromHost
}

function extractUniverseFromHost (host) {
    // Remove port
    const splitPort = host.split(":");

    // Keep only the first subdomain
    return splitPort[0].split("\\.")[0];
}
