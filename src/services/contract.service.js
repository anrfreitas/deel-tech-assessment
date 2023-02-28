const { Op } = require("sequelize");
const { sequelize } = require('../model')
const HttpResponse = require('../classes/HttpResponse');
const paginate = require('../helpers/paginate');

class ContractService {

    async getContractById (profileId, contractId) {
        const { Contract } = sequelize.models;

        const contract = await Contract.findOne({
            where: {
                id: contractId,
                [Op.or]: [
                    { ContractorId: profileId },
                    { ClientId: profileId },
                ]
            },
        });

        if(!contract)
            return new HttpResponse(404);

        return new HttpResponse(200, contract);
    }

    async getAllContracts (profileId, page = 0, limit = 10) {
        const { Contract } = sequelize.models;
        const contracts = await Contract.findAll(
            paginate({
                where: {
                    [Op.or]: [
                        { ContractorId: profileId },
                        { ClientId: profileId },
                    ]
                }
            },
            { page, pageSize: limit }
        ));

        return new HttpResponse(200, contracts);
    }
}

module.exports = ContractService;
