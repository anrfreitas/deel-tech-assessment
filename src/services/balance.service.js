const { sequelize } = require('../model')
const HttpResponse = require('../classes/HttpResponse');
const ObjectValidator = require('../classes/ObjectValidator');
const BalanceServiceRules = require('./rules/balance.service.rules');

class BalanceService {

    async performDeposit (senderProfileId, receiverProfileId, amount) {
        const t = await sequelize.transaction();

        const { Profile, Contract, Job } = sequelize.models;

        const validation = ObjectValidator
            .validate(BalanceServiceRules.performDepositRules, { userId: receiverProfileId, amount });

        if (validation.error)
            return new HttpResponse(422, validation);

        if (!await this.#isReceiverProfileIdValid(receiverProfileId))
            return new HttpResponse(404, { error: 'User does not exist!' });

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
            const profile = await Profile.findOne({ where: { id: receiverProfileId } });

            const t1 = await Profile.increment('balance', {
                by: amount,
                where: {
                    id: receiverProfileId,
                    version: profile.version
                },
                lock: true,
                transaction: t,
            });

            if (t1 && t1[0][1]) t.commit();
            else throw new Error('Transaction failed');
        } catch (error) {
            await t.rollback();
            return new HttpResponse(422, {
                error: "We can't process your request right now. Try again."
            }, error);
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

    async #isReceiverProfileIdValid(profileId) {
        const { Profile } = sequelize.models;

        const receiverProfile = await Profile.findOne({
            where: {
                id: profileId,
            }
        });

        if (receiverProfile) return true;
        return false;
    }
}

module.exports = BalanceService;
