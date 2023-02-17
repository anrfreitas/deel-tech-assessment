const { Op } = require("sequelize");
const { sequelize } = require('../model')
const middlewares = require('../middlewares');
const config = require('../config/config');

const API_CONTEXT_PREFIX = 'jobs';

const setupContextRoutes = (app) => {
    /**
     * @returns all unpaid jobs for a user (**_either_** a client or contractor), for **_active contracts only_**
     */
    app.get(`/${API_CONTEXT_PREFIX}/unpaid`,
        [ middlewares.cache(config.DEFAULT_CACHE_TTL), middlewares.getProfile ], async (req, res) => {

        try {
            const { Contract, Job } = req.app.get('models');
            const profileId = req.headers?.profile_id;

            const jobs = await Job.findAll({
                where: {
                    paid: false,
                },
                include: {
                    model: Contract,
                    required: true,
                    where: {
                        [Op.or]: [
                            { status: 'new' },
                            { status: 'in-progress' },
                        ],
                        [Op.or]: [
                            { ContractorId: profileId },
                            { ClientId: profileId },
                        ]
                    },
                },
            });

            return res.json(jobs);
        } catch (error) {
            return res.status(500).send();
        }
    });

    /**
     * @requestBody { amount: number }
     * @description It processes pay for a job, a client can only pay if his balance >= the amount to pay.
     * The amount should be moved from the client's balance to the contractor balance.
     */
    app.post(`/${API_CONTEXT_PREFIX}/:jobId/pay`, [ middlewares.getProfile ], async (req, res) => {

        try {
            const t = await sequelize.transaction();

            const { Profile, Contract, Job } = req.app.get('models');
            const clientProfileId = req.headers?.profile_id;
            const { jobId } = req.params;

            const jobInfo = await Job.findOne({
                where: {
                    id: jobId,
                },
                include: {
                    model: Contract,
                    required: true,
                    where: {
                        ClientId: clientProfileId,
                    },
                    include: {
                        model: Profile,
                        as: 'Client',
                        required: true,
                    },
                },
            });

            if (!jobInfo) {
                return res.status(403).json({
                    error: "This Job's Contract does not belong to you!"
                });
            }

            if(jobInfo.paid) {
                return res.status(422).json({
                    error: "This Job was already paid!"
                });
            }

            try {
                if (jobInfo.Contract.Client.balance > jobInfo.price) {
                    await Profile.decrement('balance', { by: jobInfo.price, where: { id: clientProfileId }, lock: true, transaction: t });
                    await Profile.increment('balance', { by: jobInfo.price, where: { id: jobInfo.Contract.ContractorId }, lock: true, transaction: t });
                    await Job.update(
                        { paid: true },
                        {
                            where: { id: jobId },
                            lock: true,
                            transaction: t,
                        }
                    );
                    await t.commit();
                } else {
                    await t.rollback();
                    return res.status(422).json({ error: "You have insuficient funds!"});
                }
            } catch(e) {
                await t.rollback();
                return res.status(400).send();
            }

            return res.status(204).send();

        } catch (error) {
            return res.status(500).send();
        }
    });
}

module.exports = { setupContextRoutes }




