const moment = require('moment');

function isValidDate(textDate) {
    return moment(textDate, 'YYYY-MM-DD').isValid();
}

function getDate(textDate) {
    return moment(textDate, 'YYYY-MM-DD').toDate();
}

module.exports = { isValidDate, getDate };
