const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Blockchain = require("./block");
const { Transaction, generateKeyPair } = require("./transaction");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const blockchain = new Blockchain();

// API tạo cặp khóa RSA
app.get("/generate_keys", (req, res) => {
    const keys = generateKeyPair();
    res.json({ privateKey: keys.privateKey, publicKey: keys.publicKey });
});

// API thêm giao dịch (có chữ ký số)
app.post("/add_transaction", (req, res) => {
    const { senderPublicKey, recipientPublicKey, amount, signature } = req.body;
    if (!senderPublicKey || !recipientPublicKey || !amount || !signature) {
        return res.status(400).json({ message: "Thiếu thông tin giao dịch!" });
    }
    const transaction = new Transaction(senderPublicKey, recipientPublicKey, amount);
    transaction.signature = signature;

    try {
        blockchain.addTransaction(transaction);
        res.json({ message: "Giao dịch đã thêm vào danh sách chờ!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// API đào block
app.get("/mine_block", (req, res) => {
    if (blockchain.pendingTransactions.length === 0) {
        return res.status(400).json({ message: "Không có giao dịch nào để đào!" });
    }
    const newBlock = blockchain.mineNewBlock();
    res.json({
        message: "Block mới đã được đào!",
        index: newBlock.index,
        hash: newBlock.hash,
        nonce: newBlock.nonce
    });
});

// API lấy danh sách blockchain
app.get("/get_chain", (req, res) => {
    res.json(blockchain.chain);
});

// API kiểm tra blockchain hợp lệ
app.get("/validate_chain", (req, res) => {
    res.json({ valid: blockchain.isChainValid() });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
