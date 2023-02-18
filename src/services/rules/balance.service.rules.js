const Joi = require('joi');

const performDepositRules = Joi.object({
    userId: Joi.string().required(),
    amount: Joi.number().required(),
});

module.exports = {
    performDepositRules,
}