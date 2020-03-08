let faker = require('faker');
let _ = require('underscore');
const util = require('../util/toolbox');
const toolbox = new util();

let document_type = ['GJ', 'CD', 'CR', 'SJ', 'PJ', 'PL', 'AR', 'AP',
    'FA', 'IA', 'SC', 'SO', 'PC', 'PR', 'PO', 'GS', 'GR', 'OT'];
let posting_status = ['Posted', 'Non-posted'];
let transaction_line_number;

class CsvModel {
    getEntryID() {
        return faker.random.uuid();
    }

    getEntryNumber() {
        return faker.random.number();
    }

    getDocumentType() {
        return _.sample(document_type);
    }

    getEffectiveDate() {
        let datetime = faker.date.past();
        return toolbox.formatDatetime(datetime, false);
    }

    getPostingDate(isMultiYear) {
        let dateTime;
        if (isMultiYear) {
            dateTime = faker.date.between(2000, 2022);
        } else {
            dateTime = faker.date.between(2021, 2022);
        }
        return toolbox.formatDatetime(dateTime, true);
    }

    getPostingStatus() {
        return _.sample(posting_status);
    }

    getPostBy() {
        return `${faker.name.firstName()} ${faker.name.lastName()}`;
    }

    getEntryApprovedBy() {
        return `${faker.name.firstName()} ${faker.name.lastName()}`;
    }

    getDetailComment() {
        return faker.random.words();
    }

    getAccountID() {
        return faker.finance.account();
    }

    getAccountName() {
        return [faker.finance.accountName(), faker.finance.mask()].join(' ')
    }

    getAmount(min, max) {
        return faker.finance.amount(min, max);
    }

    getHeader() {
        return ['entry_id', 'entry_number', 'doc_type', 'detail_comment', 'entered_date', 'posting_date', 'post_by', 'posting_status',
            'approved_by', 'account_id', 'account_name', 'amount']
    }

    createTransaction() {
        // console.log(transaction);
        return [this.getEntryID(),
            this.getEntryNumber(),
            this.getDocumentType(),
            this.getDetailComment(),
            this.getEffectiveDate(),
            this.getPostingDate(),
            this.getPostBy(),
            this.getPostingStatus(),
            this.getEntryApprovedBy(),
            this.getAccountID(),
            this.getAccountName(),
            this.getAmount()];
    }
}

module.exports = CsvModel;
