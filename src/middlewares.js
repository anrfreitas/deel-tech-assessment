const { getProfile } = require('./middlewares/getProfile');
const cache = require('./cache');

const middlewares = {
    getProfile,
    cache,
};

module.exports = middlewares;