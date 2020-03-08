let faker = require('faker');
let _ = require('underscore');

const toolbox = require('../util/toolbox');
let document_type = ['GJ', 'CD', 'CR', 'SJ', 'PJ', 'PL', 'AR', 'AP',
    'FA', 'IA', 'SC', 'SO', 'PC', 'PR', 'PO', 'GS', 'GR', 'OT'];
let posting_status = ['Posted', 'Non-posted'];

module.exports.getEntryID = function () {
    return faker.random.uuid();
};
module.exports.getEntryNumber = function () {
    return faker.random.number();
};
module.exports.getDocumentType = function () {
    return _.sample(document_type);
};

module.exports.getEffectiveDate = function () {
    let datetime = faker.date.past();
    return toolbox.formatDatetime(datetime, false);
};
module.exports.getPostingDate = function (isMultiYear) {
    let dateTime;
    if (isMultiYear) {
        dateTime = faker.date.between(2000, 2022);
    } else {
        dateTime = faker.date.between(2021, 2022);
    }
    return toolbox.formatDatetime(dateTime, true);
};
module.exports.getPostingStatus = function () {
    return _.sample(posting_status);
};

module.exports.getPostBy = function () {
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
module.exports.getHeader = function () {
    return ['entry_id', 'entry_number', 'doc_type', 'detail_comment', 'entered_date', 'posting_date', 'post_by', 'posting_status',
        'approved_by', 'account_id', 'account_name', 'amount'];
};
