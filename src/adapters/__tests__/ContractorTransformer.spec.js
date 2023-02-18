const mockDbOutput = require('./mocks/contractorInfoDbOutput.json');
const ContractorTransformer = require('../ContractorTransformer');

describe('Testing ContractorTransformer', () => {
    test('should return correctly the output object', () => {
        const transformedObject =
            ContractorTransformer.getBestProfessionalResponse(mockDbOutput);
        expect(transformedObject.id).toBe(7);
        expect(transformedObject.fullName).toBe('Alan Turing');
        expect(transformedObject.earned).toBe(2020);
    });

    test('passing an empty payload should return an empty object', () => {
        const transformedObject =
            ContractorTransformer.getBestProfessionalResponse({});
        expect(transformedObject).toMatchObject({});
    });

    test('passing null should return an empty object', () => {
        const transformedObject =
            ContractorTransformer.getBestProfessionalResponse(null);
        expect(transformedObject).toMatchObject({});
    });
});
