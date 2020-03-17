"use strict";
let moment = require('moment');
const fs = require('fs');
const csvModel = require('../engine/csv-model');
module.exports.formatDatetime = function (datetime, formatTime) {
    if (formatTime) {
        return moment(datetime).format('DD/MM/YYYY h:mm:ss A');
    }
    return moment(datetime).format('DD/MM/YYYY');

};

module.exports.generateUsers = function (number = 5000) {
    let filePath = `${process.cwd()}/resource/users.csv`;
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted users.csv file `);
    }
    for (let i = 0; i < number; i++) {
        let user = csvModel.getEntryApprovedBy();
        fs.writeFileSync(`${process.cwd()}/resource/users.csv`, `${user},` + '\n', {flag: 'a'});
    }
    console.log(`Generated ${number} Users in ${filePath}`);
};

module.exports.generateAccounts = function (number = 10000) {
   /* let accIdFile = `${process.cwd()}/resource/accountId.csv`;
    if (fs.existsSync(accIdFile)) {
        fs.unlinkSync(accIdFile);
        console.log(`Deleted accountId.csv file `);
    }
    for (let i = 0; i < number; i++) {
        let accountId = csvModel.getAccountID();
        // let accountName = csvModel.getAccountName();
        let accString = `${accountId}`;
        fs.writeFileSync(`${accIdFile}`, `${accString},` + '\n', {flag: 'a'});
    }
    console.log(`Generated ${number} Account ids in ${accIdFile}`);*/

    let accNameFile = `${process.cwd()}/resource/accountName.csv`;
    if (fs.existsSync(accNameFile)) {
        fs.unlinkSync(accNameFile);
        console.log(`Deleted accountName.csv file `);
    }
    for (let i = 0; i < number; i++) {
        let accountName = csvModel.getAccountName();
        let accString = `${accountName}`;
        fs.writeFileSync(`${accNameFile}`, `${accString},` + '\n', {flag: 'a'});
    }
    console.log(`Generated ${number} Account names in ${accNameFile}`);
};
