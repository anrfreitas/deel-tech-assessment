const supertest = require('supertest');
const app = require('../../app');

describe('Test Contracts Routes (Integration tests)', () => {
    test('GET /contracts/1 - should return successful response', async () => {
        const response = await supertest(app)
            .get('/contracts/1').set('profile_id', '1');

        expect(response.statusCode).toEqual(200);
        expect(response.body.id).toEqual(1);
        expect(response.body.terms).toEqual('bla bla bla');
        expect(response.body.status).toEqual('terminated');
        expect(response.body.ContractorId).toEqual(5);
        expect(response.body.ClientId).toEqual(1);
    });

    test('GET /contracts/1 - should return not authorized response', async () => {
        const response = await supertest(app)
            .get('/contracts/1');

        expect(response.statusCode).toEqual(401);
    });
});