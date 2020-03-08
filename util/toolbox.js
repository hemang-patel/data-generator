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

module.exports.generateAccounts = function (number = 5000) {
    let filePath = `${process.cwd()}/resource/accounts.csv`;
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted accounts.csv file `);
    }
    for (let i = 0; i < number; i++) {
        let accountId = csvModel.getAccountID();
        let accountName = csvModel.getAccountName();
        let accString = `${accountId}:${accountName},`;
        fs.writeFileSync(`${process.cwd()}/resource/accounts.csv`, `${accString}` + '\n', {flag: 'a'});
    }
    console.log(`Generated ${number} Accounts in ${filePath}`);
};
