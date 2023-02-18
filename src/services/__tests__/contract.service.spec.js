const ContractService = require('../contract.service');

const responseMock = {
    "id": 1,
    "terms": "bla bla bla",
    "status": "terminated",
    "version": 0,
    "createdAt": "2023-02-18T13:52:49.930Z",
    "updatedAt": "2023-02-18T13:52:49.930Z",
    "ContractorId": 5,
    "ClientId": 1
};

jest.mock('../../model');
const { sequelize } = require('../../model');

describe('Test Contract Service', () => {

    describe('getContractById function', () => {

        test('should return http response 404', async () => {
            //arrange
            const findOneMock = jest.fn(() => {});

            sequelize.models.Contract = {
                findOne: findOneMock,
            };

            // action
            const result = await new ContractService().getContractById(1, 1);

            // assertions
            expect(result.getStatus()).toBe(404);
            expect(result.getMessage()).toMatchObject({});
            expect(findOneMock).toHaveBeenCalledTimes(1);
        });

        test('should return http response 200', async () => {
            //arrange
            const findOneMock = jest.fn(() => responseMock);

            sequelize.models.Contract = {
                findOne: findOneMock,
            };

            // action
            const result = await new ContractService().getContractById(1, 1);

            // assertions
            expect(result.getStatus()).toBe(200);
            expect(result.getMessage()).toMatchObject(responseMock);
            expect(findOneMock).toHaveBeenCalledTimes(1);
        });
    });
});
