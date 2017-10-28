const crypto = require('crypto');


class Signature {
    constructor({timestamp, nonce, token }) {
        this.timestamp = timestamp || Date.now();
        this.nonce = nonce || crypto.randomBytes(16).toString("hex");
        this.token = token;
    }

    sign() {
        return sha1([this.timestamp, this.nonce, this.token].sort().join("").toLocaleLowerCase());
    }

    matches(signature) {
        return this.sign() === signature;
    }
}

function sha1(txt) {
    const shasum = crypto.createHash('sha1');
    shasum.update(txt);
    return shasum.digest('hex');
}


module.exports = Signature;
