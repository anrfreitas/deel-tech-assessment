const mockDbOutput = require('./mocks/clientInfoDbOutput.json');
const ClientTransformer = require('../ClientTransformer');

describe('Testing ClientTransformer', () => {
    test('should return correctly the output object', () => {
        const transformedObject =
            ClientTransformer.getBestClientsResponse(mockDbOutput);

        expect(transformedObject[0].id).toBe(4);
        expect(transformedObject[0].fullName).toBe('Ash Kethcum');
        expect(transformedObject[0].paid).toBe(2020);

        expect(transformedObject[1].id).toBe(2);
        expect(transformedObject[1].fullName).toBe('Mr Robot');
        expect(transformedObject[1].paid).toBe(442);

        expect(true).toBe(true);
    });

    test('passing an empty payload should return an empty object', () => {
        const transformedObject =
            ClientTransformer.getBestClientsResponse({});
        expect(transformedObject).toMatchObject({});
    });

    test('passing null should return an empty object', () => {
        const transformedObject =
            ClientTransformer.getBestClientsResponse(null);
        expect(transformedObject).toMatchObject({});
    });
});
