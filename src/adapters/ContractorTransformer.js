class ContractorTransformer {
    static getBestProfessionalResponse(dbOutput) {
        try {
            const contractorInfo = dbOutput.dataValues.Contract.Contractor;

            return {
                id: contractorInfo.id,
                fullName: `${contractorInfo.firstName} ${contractorInfo.lastName ?? ''}`,
                earned: dbOutput.dataValues.totalEarned,
            };
        }
        catch (e) {
            return {};
        }
    }
}

module.exports = ContractorTransformer;
