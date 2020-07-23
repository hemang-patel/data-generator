const csvModel = require('./engine/csv-model');
const csvWriter = require('csv-write-stream');
const fs = require('fs');
const _ = require('underscore');
const toolbox = require('./util/toolbox');

let writer;
let line = [];
let accountIds = [];
let accountNames = [];
let users = [];

const NO_OF_TRANSACTIONS = 10000;
const LINE_PER_TRANSACTION = 2;
const NO_OF_ACCOUNTS = 50; // Max: 10000
const NO_OF_USERS = 10; // Max: 5000
const IS_MULTI_YEAR = true;
const MIN_AMOUNT = -100000;
const MAX_AMOUNT = 100000;
const FOLDER_NAME = 'performance-testing';

var data = [];

class index {
    main() {
         toolbox.generateUsers(15000);
         toolbox.generateAccounts(15000);


        // Store NO_OF_ACCOUNTS from accounts.csv (5k account id and name) to an array
        this.fillAnArray('accountId');
        this.fillAnArray('accountName');
        // Store NO_OF_ACCOUNTS from users.csv (5k user) to an array
        this.fillAnArray('users');
        this.generateCSV(NO_OF_TRANSACTIONS, LINE_PER_TRANSACTION, this.createFileName());
    }

    fillAnArray(type) {
        switch (type) {
            case 'accountId':
                let totalAccId = fs.readFileSync('resource/accountId.csv', 'utf-8').split('\r');
                for (let i = 0; i < NO_OF_ACCOUNTS; i++) {
                    accountIds[i] = totalAccId[i];
                }
                break;
            case 'accountName':
                let totalAccNames = fs.readFileSync('resource/accountName.csv', 'utf-8').split('\r');
                for (let i = 0; i < NO_OF_ACCOUNTS; i++) {
                    accountNames[i] = totalAccNames[i];
                }
                break;
            case 'users':
                let totalUsers = fs.readFileSync('resource/users.csv', 'utf-8').split(',');
                for (let i = 0; i < NO_OF_USERS; i++) {
                    users[i] = totalUsers[i];
                }
                break;
        }
    }

    createFileName() {
        let noOfTransactions;
        let noOfTxsLength = NO_OF_TRANSACTIONS.toString().length;
        if (noOfTxsLength === 6) {
            noOfTransactions = `${NO_OF_TRANSACTIONS.toString().slice(0, noOfTxsLength / 2)}k`;
        }
        if (noOfTxsLength === 7) {
            noOfTransactions = `${NO_OF_TRANSACTIONS.toString().slice(0, 1)}M`;
        }
        if (noOfTxsLength === 8) {
            noOfTransactions = `${NO_OF_TRANSACTIONS.toString().slice(0,)}M`;
        }
        if (IS_MULTI_YEAR) {
            return `${LINE_PER_TRANSACTION}_Lines-${noOfTransactions}_Txs-${NO_OF_ACCOUNTS}_A-${NO_OF_USERS}_U-multiYear`;
        } else {
            return `${LINE_PER_TRANSACTION}_Lines-${noOfTransactions}_Txs-${NO_OF_ACCOUNTS}_A-${NO_OF_USERS}_U`;
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

                    enteredBy = enteredBy.toString().trim();
                    let postingStatus = csvModel.getPostingStatus();
                    let entryApprovedBy = _.sample(users);
                    entryApprovedBy = entryApprovedBy.toString().trim();
                    let accountID = _.sample(accountIds);
                  //  accountID = accountID.toString().trim();
                    let accountName = _.sample(accountNames);

                    let lineNumber = csvModel.getLineNumber();
                  //  accountName = accountName.toString().trim();
                    let amount = csvModel.getAmount(MIN_AMOUNT, MAX_AMOUNT);
                    line = [entryID, entryNumber, documentType, postingDate, enteredDate, enteredBy, postingStatus, entryApprovedBy,
                        detailComment, accountID, accountName, amount];
                    process.stdout.write(`Creating Transaction ${i + 1}, line ${j + 1} ` + '\r');
                    writer.write(line);


                    //JSON File
                    var obj = {
                        'id': entryID,
                        'accountID': accountID,
                        'posting': postingDate,
                        'total': amount,
                        'person': enteredBy,
                        'prop': 'lc21f1c6-f043-4cf2',
                        'accountMainDescription': 'account-Ä-main',
                        'number': entryNumber,
                        'lineNumber': lineNumber,
                        'detailComment': detailComment,
                        'documentType': documentType,
                        'documentNumber': lineNumber,
                        'documentApplyToNumber': lineNumber,
                        'identifierCode': lineNumber

                    };

                    // pushing each object here in array
                    data.push(obj);
                }
            }

            var json_string = JSON.stringify(data);


            fs.writeFile("C:\\Users\\pavan.vasu\\pavan\\JSON Generated\\10000_Transactions_20K-TransactionLines.json", json_string, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
            writer.end();
            console.log(`Created:
                        Total Entries: ${noOfTransactions * linePerTransaction}
                        Transactions: ${noOfTransactions}
                        Line per Transactions: ${linePerTransaction}
                        Accounts: ${NO_OF_ACCOUNTS}
                        Users: ${NO_OF_USERS}
                        Is Multi-year?: ${IS_MULTI_YEAR}
                        File: ${FOLDER_NAME}/${filename}.csv`);
            console.log(`Elapsed time: ${((new Date().getTime() - start) / 1000) / 60} minute`);
        } catch (err) {
            console.error(err);
        }
    }
}

index.prototype.main();
// ISSUE - cwi.outliers_CBLOF failing - https://search-elk-cwcloudtest-7licp5nanfmcpk4g5prkpi4mb4.us-east-1.es.amazonaws.com/_plugin/kibana/app/kibana#/doc/logstash-*/logstash-20200308/access_log?id=_EKVu3ABV0tMhyqqCjym&_g=()
