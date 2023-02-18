const middlewares = require('../middlewares');
const BalanceController = require('../controllers/balance.controller');

const API_CONTEXT_PREFIX = 'balances';

const setupContextRoutes = (app) => {
    /**
     * @pathParam userId: <number>
     * @description deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
     */
    app.post(`/${API_CONTEXT_PREFIX}/deposit/:userId`, [ middlewares.getProfile ], async (req, res) => {
        const httpResponse = await BalanceController
            .performDeposit(req.headers?.profile_id, req.params?.userId, req.body?.amount);
        return httpResponse.processResponse(res);
    });
}

module.exports = { setupContextRoutes }
