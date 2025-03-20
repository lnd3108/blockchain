const crypto = require("crypto");
const { Transaction } = require("./transaction");

class Block {
    constructor(index, transactions, previousHash = "") {
        this.index = index;
        this.timestamp = Date.now();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto
            .createHash("sha256")
            .update(
                this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce
            )
            .digest("hex");
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

class Blockchain {
    constructor(difficulty = 4) {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.difficulty = difficulty;
    }

    createGenesisBlock() {
        return new Block(0, [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addTransaction(transaction) {
        if (!transaction.isValid()) {
            throw new Error("Giao dịch không hợp lệ!");
        }
        this.pendingTransactions.push(transaction);
    }

    mineNewBlock() {
        const newBlock = new Block(this.chain.length, this.pendingTransactions, this.getLatestBlock().hash);
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        this.pendingTransactions = [];
        return newBlock;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) return false;
            if (currentBlock.previousHash !== previousBlock.hash) return false;
        }
        return true;
    }
}

module.exports = Blockchain;
