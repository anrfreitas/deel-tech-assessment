const { Op } = require("sequelize");
const { sequelize } = require('../model')
const dateHelper = require('../helpers/dates');
const ClientTransformer = require('../adapters/ClientTransformer');
const ContractorTransformer = require('../adapters/ContractorTransformer');
const HttpResponse = require('../classes/HttpResponse');
const ObjectValidator = require('../classes/ObjectValidator');
const AdminServiceRules = require('./rules/admin.service.rules');

class AdminService {

    async getBestProfessional (startDateStr, endDateStr) {
        const { Profile, Contract, Job } = sequelize.models;

        const validation = ObjectValidator
            .validate(AdminServiceRules.getBestProfessionalRules, { start: startDateStr, end: endDateStr });

        if (validation.error)
            return new HttpResponse(422, validation);

        const startDate = dateHelper.getDate(startDateStr);
        const endDate = dateHelper.getDate(endDateStr);

        const result = await Job.findOne({
            where: {
                paid: true,
                updatedAt: {
                    [Op.between]: [
                        startDate,
                        endDate,
                    ]
                },
            },
            attributes: [
                'Contract.ContractorId', [sequelize.fn('SUM', sequelize.col('price')), 'totalEarned']
            ],
            include: {
                model: Contract,
                require: true,
                include: {
                    model: Profile,
                    require: true,
                    as: 'Contractor',
                },
            },
            group: ['Contract.ContractorId'],
            order: [['totalEarned', 'DESC']],
        });

        return new HttpResponse(200, ContractorTransformer.getBestProfessionalResponse(result));
    }

    async getBestClients (startDateStr, endDateStr, limit = 2) {
        const { Profile, Contract, Job } = sequelize.models;

        const validation = ObjectValidator.validate(
            AdminServiceRules.getBestClientsRules,
            { start: startDateStr, end: endDateStr, limit }
        );

        if (validation.error)
            return new HttpResponse(422, validation);

        const startDate = dateHelper.getDate(startDateStr);
        const endDate = dateHelper.getDate(endDateStr);

        const result = await Job.findAll({
            where: {
                paid: true,
                updatedAt: {
                    [Op.between]: [
                        startDate,
                        endDate,
                    ]
                },
            },
            attributes: [
                'Contract.ClientId', [sequelize.fn('SUM', sequelize.col('price')), 'totalPaid']
            ],
            include: {
                model: Contract,
                require: true,
                include: {
                    model: Profile,
                    require: true,
                    as: 'Client',
                },
            },
            group: ['Contract.ClientId'],
            order: [['totalPaid', 'DESC']],
            limit,
        });

        return new HttpResponse(200, ClientTransformer.getBestClientsResponse(result));
    }
}

module.exports = AdminService;
