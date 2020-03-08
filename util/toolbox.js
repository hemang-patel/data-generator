let moment = require('moment');

class Toolbox {
    formatDatetime(datetime, formatTime) {
        if (formatTime) {
            return moment(datetime).format('DD/MM/YYYY h:mm:ss A');
        }
        return moment(datetime).format('DD/MM/YYYY');
    }
}

module.exports = Toolbox;
