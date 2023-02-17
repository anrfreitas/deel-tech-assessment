const { Op } = require("sequelize");
const middlewares = require('../middlewares');
const config = require('../config/config');

const API_CONTEXT_PREFIX = 'contracts';

const setupContextRoutes = (app) => {
    /**
     * @returns contract by id only if it belongs to the profile calling
     */
    app.get(`/${API_CONTEXT_PREFIX}/:id`,
        [ middlewares.cache(config.DEFAULT_CACHE_TTL), middlewares.getProfile ], async (req, res) => {

        try {
            const { Contract } = req.app.get('models');
            const profileId = req.headers?.profile_id;
            const { id } = req.params;

            const contract = await Contract.findOne({
                where: {
                    id, [Op.or]: [
                        { ContractorId: profileId },
                        { ClientId: profileId },
                    ]
                },
            });

            if(!contract)
                return res.status(404).end();

            return res.json(contract);

        } catch (error) {
            return res.status(500).send();
        }
    });

    /**
     * @returns: a list of contracts belonging to a user (client or contractor), the list contains non terminated contracts.
     */
    app.get(`/${API_CONTEXT_PREFIX}`,
        [ middlewares.cache(config.DEFAULT_CACHE_TTL), middlewares.getProfile ], async (req, res) => {

        try {
            const { Contract } = req.app.get('models');
            const profileId = req.headers?.profile_id;
            const contract = await Contract.findAll({
                where: {
                    [Op.or]: [
                        { ContractorId: profileId },
                        { ClientId: profileId },
                    ]
                }
            });

            if(!contract)
                return res.status(404).end();

            return res.json(contract);
        } catch (error) {
            return res.status(500).send();
        }
    });
}

module.exports = { setupContextRoutes }




