const crypto = require("crypto");

class Transaction {
    constructor(senderPublicKey, recipientPublicKey, amount) {
        this.senderPublicKey = senderPublicKey;
        this.recipientPublicKey = recipientPublicKey;
        this.amount = amount;
        this.signature = "";
    }

    signTransaction(privateKey) {
        const signer = crypto.createSign("SHA256");
        signer.update(this.senderPublicKey + this.recipientPublicKey + this.amount);
        this.signature = signer.sign(privateKey, "hex");
    }

    isValid() {
        if (!this.signature || this.signature.length === 0) return false;
        const verifier = crypto.createVerify("SHA256");
        verifier.update(this.senderPublicKey + this.recipientPublicKey + this.amount);
        return verifier.verify(this.senderPublicKey, this.signature, "hex");
    }
}

// Hàm tạo Private Key & Public Key
function generateKeyPair() {
    return crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" }
    });
}

module.exports = { Transaction, generateKeyPair };
