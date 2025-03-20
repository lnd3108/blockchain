const express = require('express');
const cors = require('cors');
const Blockchain = require('./blockchain');

const app = express();
const blockchain = new Blockchain();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/transaction', (req, res) => {
    const { sender, recipient, amount } = req.body;
    blockchain.createTransaction({ sender, recipient, amount });
    res.json({ message: "Giao dịch đã được thêm!", pendingTransactions: blockchain.pendingTransactions });
});

app.get('/mine', (req, res) => {
    const block = blockchain.minePendingTransactions();
    res.json({ message: "Block mới đã được đào!", block });
});

app.get('/chain', (req, res) => {
    res.json({ chain: blockchain.chain });
});

app.listen(5000, () => console.log("Server chạy tại http://127.0.0.1:5000"));
