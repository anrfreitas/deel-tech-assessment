const { Op } = require("sequelize");
const { sequelize } = require('../model')
const middlewares = require('../middlewares');
const dateHelper = require('../helpers/dates');
const config = require('../config/config');
const ClientTransformer = require('../adapters/ClientTransformer');
const ContractorTransformer = require('../adapters/ContractorTransformer');

const API_CONTEXT_PREFIX = 'admin';

const setupContextRoutes = (app) => {
    /**
     * @param start - date (yyyy-mm-dd)
     * @param end   - date (yyyy-mm-dd)
     *
     * @returns the professional that earned the most money (sum of jobs paid) for any contractor that worked in the query time range.
     * @responeBody { id: number, fullName: string, earned : number },
     */
    app.get(`/${API_CONTEXT_PREFIX}/best-professional`,
        [ middlewares.cache(config.DEFAULT_CACHE_TTL), middlewares.getProfile ], async (req, res) => {

        try {
            const { Profile, Contract, Job } = req.app.get('models');

            /*
                @TODO Input validation
                I'm doing it manually here, but would be great to have something to validate our payloads
            */
            if (!dateHelper.isValidDate(req.query?.start) ||
                    !dateHelper.isValidDate(req.query?.end)) {

                return res.status(422).json({
                    error: 'Input date is in incorrect format.'
                });
            }

            const startDate = dateHelper.getDate(req.query.start);
            const endDate = dateHelper.getDate(req.query.end);

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

            return res.json(ContractorTransformer.getBestProfessionalResponse(result));
        } catch (error) {
            return res.status(500).send();
        }
    });

    /**
     * @param start - date (yyyy-mm-dd)
     * @param end   - date (yyyy-mm-dd)
     * @param limit - number
     *
     * @returns returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
     * @responeBody { id: number, fullName: string, paid : number },
     */
    app.get(`/${API_CONTEXT_PREFIX}/best-clients`,
        [ middlewares.cache(config.DEFAULT_CACHE_TTL), middlewares.getProfile ], async (req, res) => {

        try {
            const { Profile, Contract, Job } = req.app.get('models');

            /*
                @TODO Input validation
                I'm doing it manually here, but would be great to have something to validate our payloads
            */
            if (!dateHelper.isValidDate(req.query?.start) ||
                    !dateHelper.isValidDate(req.query?.end)) {

                return res.status(422).json({
                    error: 'Input date is in incorrect format.'
                });
            }

            if(isNaN(req.query?.limit)) {
                return res.status(422).json({
                    error: 'Input limit is not a number'
                });
            }

            const startDate = dateHelper.getDate(req.query.start);
            const endDate = dateHelper.getDate(req.query.end);
            const limit = req.query.limit ?? 2;

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

            return res.json(ClientTransformer.getBestClientsResponse(result));
        } catch (error) {
            return res.status(500).send();
        }
    });
}

module.exports = { setupContextRoutes }




