const { sequelize } = require('../model')
const middlewares = require('../middlewares');

const API_CONTEXT_PREFIX = 'balances';

const setupContextRoutes = (app) => {
    /**
     * @description deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
     */
    app.post(`/${API_CONTEXT_PREFIX}/deposit/:userId`, [ middlewares.getProfile ], async (req, res) => {

        try {
            const t = await sequelize.transaction();
            const { Profile, Contract, Job } = req.app.get('models');
            const clientProfileId = req.headers?.profile_id;
            const { userId } = req.params;
            const { amount } = req.body;

            const jobs = await Job.findAll({
                where: {
                    paid: false,
                },
                include: {
                    model: Contract,
                    require: true,
                    where: {
                        ClientId: userId,
                    },
                }
            });

            const amountToPay = jobs.reduce((currentValue, item) => {
                return currentValue += item.price;
            }, 0);

            const limitPermitedToDeposit = amountToPay * (25/100);

            /*
                @TODO Input validation
                I'm doing it manually here, but would be great to have something to validate our payloads
            */
            if (isNaN(amount) || typeof amount !== 'number' ) {
                return res.status(422).json({
                    error: 'Amount field is not in correct format'
                });
            }

            if (amount > limitPermitedToDeposit) {
                return res.status(422).json({
                    error: "You can't deposit more than 25% your total of jobs to pay",
                    info: {
                        amountToDeposit: amount,
                        amountToPay,
                        limitPermitedToDeposit,
                    }
                });
            }

            try {
                /**
                 * @todo - hey! I got a little confused here, where is this balance coming from?
                 *
                 * I gotta talk to the P.O to understand if it'll be deducted of the balance from person who's doing the request.
                 */
                await Profile.increment('balance', { by: amount, where: { id: userId }, lock: true, transaction: t });
                t.commit();
            } catch (error) {
                await t.rollback();
                return res.status(422).json({ error: "We can't process your request right now. Try again."});
            }


            const recipientProfile = await Profile.findOne({
                where: {
                    id: clientProfileId,
                },
            });

            const receiverProfile = await Profile.findOne({
                where: {
                    id: userId,
                }
            });

            return res.json({
                recipient: recipientProfile,
                receiver: receiverProfile,
                depositedAmount: amount.toFixed(2),
            });
        } catch (error) {
            return res.status(500).send();
        }
    });
}

module.exports = { setupContextRoutes }
