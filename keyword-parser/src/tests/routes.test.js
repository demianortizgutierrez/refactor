const supertest = require("supertest");
const app = require("../app");

describe('Routes Test', () => {

    it('GET /health (200)', async () => {
        await supertest(app).get("/")
            .expect(200);
    });

    it('GET /WrongUrl (404)', async () => {
        await supertest(app).get("/WrongUrl")
            .expect(404);
    });

    it('post /keyword-parser (400) Bad Request', async () => {
        const data = {"payload": "HD HD HD HD HD HD", "pais": "CO"};

        await supertest(app).post("/keyword-parser")
            .send(data)
            .expect(400);
    });

    it('post /keyword-parser (503) service unavailable', async () => {
        const data = {"payload": "HD", "pais": "AR"};

        await supertest(app).post("/keyword-parser")
            .send(data)
            .expect(503);
    });
});
