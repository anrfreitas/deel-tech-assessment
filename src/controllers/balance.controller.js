const BalanceService = require('../services/balance.service');
const HttpResponse = require('../classes/HttpResponse');

class BalanceController {

    static async performDeposit(senderProfileId, receiverProfileId, amount) {
        try {
            return new BalanceService().performDeposit(senderProfileId, receiverProfileId, amount);
        } catch (error) {
            return new HttpResponse(500, 'Internal Server Error');
        }
    }
}

module.exports = BalanceController;
