const middlewares = require('../middlewares');
const config = require('../config/config');
const controllerModule = require('../controllers/controller.module');

const API_CONTEXT_PREFIX = 'contracts';

const setupContextRoutes = (app) => {
    /**
     * @pathParam id: <number>
     * @returns contract by id only if it belongs to the profile calling
     */
    app.get(`/${API_CONTEXT_PREFIX}/:id`,
        [ middlewares.cache(config.DEFAULT_CACHE_TTL), middlewares.getProfile ], async (req, res) => {
            const httpResponse = await controllerModule.contractController
                .getContractById(req.headers?.profile_id, req.params?.id);
            return httpResponse.processResponse(res);
    });

    /**
     * @returns a list of contracts belonging to a user (client or contractor), the list contains non terminated contracts.
     */
    app.get(`/${API_CONTEXT_PREFIX}`,
        [ middlewares.cache(config.DEFAULT_CACHE_TTL), middlewares.getProfile ], async (req, res) => {
            const httpResponse = await controllerModule.contractController
                .getAllContracts(req.headers?.profile_id, req.query?.page, req.query?.limit);
            return httpResponse.processResponse(res);
    });
}

module.exports = { setupContextRoutes }




