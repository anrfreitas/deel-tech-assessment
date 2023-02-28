const ContractService = require('../services/contract.service');
const HttpResponse = require('../classes/HttpResponse');

class ContractController {

    static async getContractById (profileId, contractId) {
        try {
            return new ContractService().getContractById(profileId, contractId);
        } catch (error) {
            return new HttpResponse(500, 'Internal Server Error', error);
        }
    }

    static async getAllContracts (profileId, page, limit) {
        try {
            return new ContractService().getAllContracts(profileId, page, limit);
        } catch (error) {
            return new HttpResponse(500, 'Internal Server Error', error);
        }
    }
}

module.exports = ContractController;
