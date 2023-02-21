// import request from "supertest";
// import app from "./app";
const request = require('supertest')
const app = require('../app')

let testServer
beforeAll(() => {
    testServer = app.listen(4000)
})

describe()

describe("GET /users", () => {
    test("should respond with a 200 status code", async () => {
        const response = await request(app).get("/users").send();
        expect(response.statusCode).toBe(200);
    });

    test("should respond an array", async () => {
        const response = await request(app).get("/users").send();
        expect(response.body).toBeInstanceOf(Array);
    });
});

describe("GET /products", () => {
    test("should respond with a 200 status code", async () => {
        const response = await request(app).get("/products").send();
        expect(response.statusCode).toBe(200);
    });

    test("should respond an array", async () => {
        const response = await request(app).get("/products").send();
        expect(response.body).toBeInstanceOf(Object);
    });
});

describe("POST /users", () => {
    describe("given a title and description", () => {
        const newTask = {
            title: "some title",
            description: "some description",
        };

        // should respond with a 200 code
        test("should respond with a 200 status code", async () => {
            const response = await request(app).post("/users").send(newTask);
            expect(response.statusCode).toBe(200);
        });

        // should respond a json as a content type
        test("should have a Content-Type: application/json header", async () => {
            const response = await request(app).post("/users").send(newTask);
            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json")
            );
        });

        // shoud respond with a json object containing the new task with an id
        test("should respond with an task ID", async () => {
            const response = await request(app).post("/users").send(newTask);
            expect(response.body.id).toBeDefined();
        });
    });

    describe("when the title and description is missing", () => {
        // should respond with a 400 code
        test("shoud respond with a 400 status code", async () => {
            const fields = [
                { title: "some title" },
                { description: "some description" },
            ];

            for (const body of fields) {
                const response = await request(app).post("/users").send(body);
                expect(response.statusCode).toBe(400);
            }
        });
    });
});



afterAll((done) => {
    testServer.close(done)
})