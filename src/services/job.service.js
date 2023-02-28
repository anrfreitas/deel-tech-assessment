const { Op } = require("sequelize");
const { sequelize } = require('../model')
const HttpResponse = require('../classes/HttpResponse');

class JobService {

    async getUnpaidJobs (profileId) {
        const { Contract, Job } = sequelize.models;

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

        return new HttpResponse(200, jobs);
    }

    async performJobPayment (clientProfileId, jobId) {
        const t = await sequelize.transaction();

        const { Profile, Contract, Job } = sequelize.models;

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
            return new HttpResponse(403, {
                error: "This Job's Contract does not belong to you!"
            });
        }

        if(jobInfo.paid) {
            return new HttpResponse(422, {
                error: "This Job was already paid!"
            });
        }

        try {
            if (jobInfo.Contract.Client.balance > jobInfo.price) {
                const clientProfile = await Profile.findOne({ where: { id: clientProfileId } });
                const contractorProfile = await Profile.findOne({ where: { id: jobInfo.Contract.ContractorId } });

                const t1 = await Profile.decrement('balance', {
                    by: jobInfo.price,
                    where: {
                        id: clientProfileId,
                        version: clientProfile.version
                    },
                    lock: true,
                    transaction: t
                });

                const t2 = await Profile.increment('balance', {
                    by: jobInfo.price,
                    where: {
                        id: jobInfo.Contract.ContractorId,
                        version: contractorProfile.version
                    },
                    lock: true,
                    transaction: t
                });

                const t3 = await Job.update(
                    { paid: true },
                    {
                        where: {
                            id: jobId,
                            version: jobInfo.version
                        },
                        lock: true,
                        transaction: t,
                    }
                );

                if (t1 && t1[0][1] && t2 && t2[0][1] && t3)
                    await t.commit();
                else {
                    await t.rollback();
                    throw new Error('Transaction failed');
                }

            } else {
                await t.rollback();
                return new HttpResponse(422, { error: "You have insuficient funds!"});
            }
        } catch(e) {
            await t.rollback();
            return new HttpResponse(422, {
                error: "We can't process your request right now. Try again."
            }, error);
        }

        return new HttpResponse(204);
    }
}

module.exports = JobService;
