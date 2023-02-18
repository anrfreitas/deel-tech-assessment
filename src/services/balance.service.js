const { sequelize } = require('../model')
const HttpResponse = require('../classes/HttpResponse');

class BalanceService {

    async performDeposit (senderProfileId, receiverProfileId, amount) {
        const t = await sequelize.transaction();

        const { Profile, Contract, Job } = sequelize.models;

        const jobs = await Job.findAll({
            where: {
                paid: false,
            },
            include: {
                model: Contract,
                require: true,
                where: {
                    ClientId: receiverProfileId,
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
            return new HttpResponse(422, {
                error: 'Amount field is not in correct format'
            });
        }

        if (amount > limitPermitedToDeposit) {
            return new HttpResponse(422, {
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
            await Profile.increment('balance', { by: amount, where: { id: receiverProfileId }, lock: true, transaction: t });
            t.commit();
        } catch (error) {
            await t.rollback();
            return new HttpResponse(422, {
                error: "We can't process your request right now. Try again."
            });
        }


        const recipientProfile = await Profile.findOne({
            where: {
                id: senderProfileId,
            },
        });

        const receiverProfile = await Profile.findOne({
            where: {
                id: receiverProfileId,
            }
        });

        return new HttpResponse(200, {
            recipient: recipientProfile,
            receiver: receiverProfile,
            depositedAmount: amount.toFixed(2),
        });
    }
}

module.exports = BalanceService;
