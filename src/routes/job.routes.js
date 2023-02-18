const middlewares = require('../middlewares');
const config = require('../config/config');
const JobController = require('../controllers/job.controller');

const API_CONTEXT_PREFIX = 'jobs';

const setupContextRoutes = (app) => {
    /**
     * @returns all unpaid jobs for a user (**_either_** a client or contractor), for **_active contracts only_**
     */
    app.get(`/${API_CONTEXT_PREFIX}/unpaid`,
        [ middlewares.cache(config.DEFAULT_CACHE_TTL), middlewares.getProfile ], async (req, res) => {
            const httpResponse = await JobController.getUnpaidJobs(req.headers?.profile_id);
            return httpResponse.processResponse(res);
    });

    /**
     * @pathParam jobId: <number>
     * @requestBody { amount: <number> }
     * @description It processes pay for a job, a client can only pay if his balance >= the amount to pay.
     * The amount should be moved from the client's balance to the contractor balance.
     */
    app.post(`/${API_CONTEXT_PREFIX}/:jobId/pay`, [ middlewares.getProfile ], async (req, res) => {
        const httpResponse = await JobController
                .performJobPayment(req.headers?.profile_id, req.params?.jobId);
        return httpResponse.processResponse(res);
    });
}

module.exports = { setupContextRoutes }




