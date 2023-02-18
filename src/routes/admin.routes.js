const middlewares = require('../middlewares');
const config = require('../config/config');
const controllerModule = require('../controllers/controller.module');

const API_CONTEXT_PREFIX = 'admin';

const setupContextRoutes = (app) => {
    /**
     * @param start - <date> (yyyy-mm-dd)
     * @param end   - <date> (yyyy-mm-dd)
     *
     * @returns the professional that earned the most money (sum of jobs paid) for any contractor that worked in the query time range.
     * @responseBody { id: <number>, fullName: <string>, earned : <number> },
     */
    app.get(`/${API_CONTEXT_PREFIX}/best-professional`,
        [ middlewares.cache(config.DEFAULT_CACHE_TTL), middlewares.getProfile ], async (req, res) => {
            const httpResponse = await controllerModule.adminController
                .getBestProfessional(req.query?.start, req.query?.end);
            return httpResponse.processResponse(res);
    });

    /**
     * @param start - <date> (yyyy-mm-dd)
     * @param end   - <date> (yyyy-mm-dd)
     * @param limit - <number>
     *
     * @returns returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
     * @responseBody { id: <number>, fullName: <string>, paid : <number> },
     */
    app.get(`/${API_CONTEXT_PREFIX}/best-clients`,
        [ middlewares.cache(config.DEFAULT_CACHE_TTL), middlewares.getProfile ], async (req, res) => {
            const httpResponse = await controllerModule.adminController
                .getBestClients(req.query?.start, req.query?.end, req.query?.limit);
            return httpResponse.processResponse(res);
    });
}

module.exports = { setupContextRoutes }




