const request = require('supertest')
const app = require('../../app')
const { mongooseConnect, mongoDisconnect } = require('../../services/mongoes');
const { loadPlanetsData } = require('../../models/planets.model');


describe('Launcg api', () => {
    beforeAll(async () => {
        await mongooseConnect();
        await loadPlanetData();
    })

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Test GET /launche', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app).get('/launche');
            expect(response.statusCode).toBe(200);
        });

    });

    describe('Test POST /launch', () => {
        const compeleteLaunchDate = {
            mission: "KeplerX",
            rocket: "Explorer IS1",
            launchDate: "November 29,2024",
            destination: "Kepler-442 b"
        }
        const inCompeleteLaunchDate = {
            mission: "KeplerX",
            rocket: "Explorer IS1",
            destination: "Kepler-442 b"
        }

        const launchInvalidDate = {
            mission: "KeplerX",
            rocket: "Explorer IS1",
            destination: "Kepler-442 b",
            launchDate: "poi",
        }

        test('response 201 post sucess', async () => {
            const response = await request(app)
                .post('/launche')
                .send(compeleteLaunchDate)
                .expect('Content-type', /json/)
                .expect(201)
            const requestDate = new Date(compeleteLaunchDate.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(requestDate).toBe(responseDate);
            expect(response.body).toMatchObject(inCompeleteLaunchDate)

        })
        test('Missing required parameter', async () => {
            const response = await request(app)
                .post('/launche')
                .send(inCompeleteLaunchDate)
                .expect('Content-type', /json/)
                .expect(400)

            expect(response.body).toStrictEqual({
                error: "missing require property"
            })
        })
        test('It should catch invalid date', async () => {
            const response = await request(app)
                .post('/launche')
                .send(launchInvalidDate)
                .expect('Content-type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: "invalid date"
            })
        })
    })
})
