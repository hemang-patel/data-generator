let faker = require('faker');
let _ = require('underscore');

const toolbox = require('../util/toolbox');
const document_type = ['GJ', 'CD', 'CR', 'SJ', 'PJ', 'PL', 'AR', 'AP',
    'FA', 'IA', 'SC', 'SO', 'PC', 'PR', 'PO', 'GS', 'GR', 'OT'];
const posting_status = ['Posted', 'Non-posted'];

module.exports.getHeader = function () {
    return ['entry_id', 'entry_number', 'doc_type', 'detail_comment', 'posting_date', 'entered_date', 'entered_by', 'posting_status',
        'entry_approved_by', 'account_id', 'account_name', 'amount'];
};

module.exports.getEntryID = function () {
    return faker.random.uuid();
};

module.exports.getEntryNumber = function () {
    return faker.random.number();
};

module.exports.getDocumentType = function () {
    return _.sample(document_type);
};

module.exports.getEnteredDate = function () {
    let datetime = faker.date.past();
    return toolbox.formatDatetime(datetime, true);
};

module.exports.getPostingDate = function (isMultiYear) {
    let dateTime;
    if (isMultiYear) {
        dateTime = faker.date.between(2000, 2022);
    } else {
        dateTime = faker.date.between(2021, 2022);
    }
    return toolbox.formatDatetime(dateTime, false);
};

module.exports.getPostingStatus = function () {
    return _.sample(posting_status);
};

module.exports.getEnteredBy = function () {
    return `${faker.name.firstName()} ${faker.name.lastName()}`;
};

module.exports.getEntryApprovedBy = function () {
    return `${faker.name.firstName()} ${faker.name.lastName()}`;
};

module.exports.getDetailComment = function () {
    return faker.random.words();
};

module.exports.getAccountID = function () {
    return faker.finance.account();
};

module.exports.getAccountName = function () {
    return [faker.finance.accountName(), faker.finance.mask()].join(' ')
};

module.exports.getAmount = function (min, max) {
    return faker.finance.amount(min, max);
};
