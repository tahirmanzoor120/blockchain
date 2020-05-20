var sha256 = require('js-sha256');

class Transaction {
    constructor(balance, credit, debit) {
        this.balance = balance;
        this.credit = credit;
        this.debit = debit;
    }
}

class Block {
    constructor(transaction) {
        this.transaction = transaction;
        this.index = 0;
        this.timestamp = new Date(); 
        this.previousHash = "0";             
        this.reCalculateHash();
    }

    reCalculateHash() {
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return sha256(this.index +
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.transaction).toString);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(new Transaction(0, 0, 0));
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.index = this.getLatestBlock().index + 1;
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.reCalculateHash();
        this.chain.push(newBlock);
    }

    credit(amount) {
        let transaction =  new Transaction(this.getBalance() + amount, amount, 0);
        this.addBlock(new Block(transaction));
    }

    debit(amount) {
        let transaction =  new Transaction(this.getBalance() - amount, 0, amount);
        this.addBlock(new Block(transaction));
    }

    getBalance(){
        return this.getLatestBlock().transaction.balance;
    }

    printStatement() {
        console.log("++++++++++++++ Start of Statement +++++++++++++++");
        console.log("Sr#    Date                                     +Credit-Debit=Balance");
        let block;
        for(block of this.chain){
            let transaction = block.transaction;
            console.log(block.index + "    " + block.timestamp + "     +" + transaction.credit + "-" + transaction.debit + "=" + transaction.balance);
        }
        console.log("++++++++++++++ End of Statement +++++++++++++++");
    }
}

let bankAccount = new Blockchain();
bankAccount.credit(1000);
bankAccount.debit(500);
bankAccount.printStatement();
