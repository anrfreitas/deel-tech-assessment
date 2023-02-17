class ClientTransformer {
    static getBestClientsResponse(dbOutput) {
        try {
            return dbOutput.map(item => {
                const clientInfo = item.dataValues.Contract.Client;
                return {
                    id: clientInfo.id,
                    fullName: `${clientInfo.firstName ?? ''} ${clientInfo.lastName ?? ''}`,
                    paid: item.dataValues.totalPaid,
                };
            });
        } catch (error) {
            return {};
        }

    }
}

module.exports = ClientTransformer;
