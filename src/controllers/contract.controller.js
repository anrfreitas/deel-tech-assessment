const ContractService = require('../services/contract.service');
const HttpResponse = require('../classes/HttpResponse');

class ContractController {

    static async getContractById (profileId, contractId) {
        try {
            return new ContractService().getContractById(profileId, contractId);
        } catch (error) {
            return new HttpResponse(500, 'Internal Server Error');
        }
    }

    static async getAllContracts (profileId) {
        try {
            return new ContractService().getAllContracts(profileId);
        } catch (error) {
            return new HttpResponse(500, 'Internal Server Error');
        }
    }
}

module.exports = ContractController;
