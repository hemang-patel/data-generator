const csvModel = require('./engine/csv-model');
const csvWriter = require('csv-write-stream');
const fs = require('fs');
const _ = require('underscore');

let writer;
let line = [];
let accounts = [];
let users = [];

const NO_OF_TRANSACTIONS = 500000;
const LINE_PER_TRANSACTION = 2;
const NO_OF_ACCOUNTS = 100; // Max: 5000
const NO_OF_USERS = 10; // Max: 5000
const IS_MULTI_YEAR = true;
// const FILE_NAME = '500k transactions - TC1'; //no file extension

const MIN_AMOUNT = -100000;
const MAX_AMOUNT = 100000;
const FOLDER_NAME = 'dataset';

class index {
    main() {
        /*toolbox.generateUsers(5000);
        toolbox.generateAccounts(5000);*/

        // Store NO_OF_ACCOUNTS from accounts.csv (5k account id and name) to an array
        this.fillAnArray('accounts');
        // Store NO_OF_ACCOUNTS from users.csv (5k user) to an array
        this.fillAnArray('users');

        this.generateCSV(NO_OF_TRANSACTIONS, LINE_PER_TRANSACTION, this.createFileName());
    }

    fillAnArray(type) {
        switch (type) {
            case 'accounts':
                let totalAccounts = fs.readFileSync('resource/accounts.csv', 'utf-8').split(',');
                for (let i = 0; i < NO_OF_ACCOUNTS; i++) {
                    accounts[i] = totalAccounts[Math.floor(Math.random() * totalAccounts.length)].trim();
                }
                break;
            case 'users':
                let totalUsers = fs.readFileSync('resource/users.csv', 'utf-8').split(',');
                for (let i = 0; i < NO_OF_USERS; i++) {
                    users[i] = totalUsers[Math.floor(Math.random() * totalUsers.length)].trim();
                }
                break;
        }
    }

    createFileName() {
        if (IS_MULTI_YEAR) {
            return `${LINE_PER_TRANSACTION}_Line-${NO_OF_TRANSACTIONS}_Txs-${NO_OF_ACCOUNTS}_A-${NO_OF_USERS}_U-multiYear`;
        } else {
            return `${LINE_PER_TRANSACTION}_Lines-${NO_OF_TRANSACTIONS}_Txs-${NO_OF_ACCOUNTS}_A-${NO_OF_USERS}_U`;
        }
    }

    generateCSV(noOfTransactions, linePerTransaction, filename) {
        let start = new Date().getTime();
        writer = csvWriter({headers: csvModel.getHeader()});
        try {
            if (!fs.existsSync(FOLDER_NAME)) {
                fs.mkdirSync(FOLDER_NAME, {recursive: true});
                console.log(`Created folder ${FOLDER_NAME}`);
            }
            writer.pipe(fs.createWriteStream(`${FOLDER_NAME}/${filename}.csv`, {flags: 'w'}));
            for (let i = 0; i < noOfTransactions; i++) {
                let entryID = csvModel.getEntryID();
                let _entryNumber = csvModel.getEntryNumber();
                for (let j = 0; j < linePerTransaction; j++) {
                    let entryNumber = Number(_entryNumber) + j;
                    let documentType = csvModel.getDocumentType();
                    let detailComment = csvModel.getDetailComment();
                    let postingDate = csvModel.getPostingDate(IS_MULTI_YEAR);
                    let enteredDate = csvModel.getEnteredDate();
                    let enteredBy = _.sample(users);
                    let postingStatus = csvModel.getPostingStatus();
                    let entryApprovedBy = _.sample(users);

                    let fullAccount = accounts[Math.floor(Math.random() * accounts.length)];
                    let accountID = fullAccount.toString().split(':')[0];
                    let accountName = fullAccount.toString().split(':')[1];

                    let amount = csvModel.getAmount(MIN_AMOUNT, MAX_AMOUNT);

                    line = [entryID, entryNumber, documentType, detailComment, postingDate, enteredDate,
                        enteredBy, postingStatus, entryApprovedBy, accountID, accountName, amount];
                    process.stdout.write(`Creating Transaction ${i + 1}, line ${j + 1} ` + '\r');
                    writer.write(line);
                }
            }
            console.log(`Created:
                        Total Transactions: ${noOfTransactions * linePerTransaction}
                        Transactions: ${noOfTransactions}
                        Line per Transactions: ${linePerTransaction}
                        Users: ${NO_OF_USERS}
                        Accounts: ${NO_OF_ACCOUNTS}
                        Is Multi-year?: ${IS_MULTI_YEAR}
                        File: ${FOLDER_NAME}/${filename}.csv`);
            console.log(`Elapsed time: ${(new Date().getTime() - start) / 1000}s`);
        } catch (err) {
            console.error(err);
        }
        writer.end();
    }
}

index.prototype.main();

// ISSUE - https://search-elk-cwcloudtest-7licp5nanfmcpk4g5prkpi4mb4.us-east-1.es.amazonaws.com/_plugin/kibana/app/kibana#/doc/logstash-*/logstash-20200308/access_log?id=_EKVu3ABV0tMhyqqCjym&_g=()

