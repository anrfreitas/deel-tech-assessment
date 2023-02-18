const Joi = require('joi');

const getBestProfessionalRules = Joi.object({
    start: Joi.date().required(),
    end: Joi.date().required(),
});

const getBestClientsRules = Joi.object({
    start: Joi.date().required(),
    end: Joi.date().required(),
    limit: Joi.number().required(),
});

module.exports = {
    getBestProfessionalRules,
    getBestClientsRules,
}