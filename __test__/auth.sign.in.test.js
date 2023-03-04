const request = require('supertest')
const app = require('../app')
const { passwordHash } = require('../src/helpers/bcrypt')
const { user } = require("../src/models")

let testServer
beforeAll(async () => {
    testServer = app.listen(3000)
})

describe("DATABASE INIT", () => {

    // Database cleaner
    test("Clean database", async () => {
        await user.sync({
            force: true
        });
    })

    // Create Admin
    test("Create Admin", async () => {
        await user.create({
            user_name: "fede",
            user_password: await passwordHash("pass"),
            user_realname: "Fede",
            user_lastname: "lastname",
            user_dni: 12345678,
            user_birthdate: "10/07/1987",
            user_role: "admin"
        });
    });

    // Create User /username letters  / -password letters
    test("Create User", async () => {
        await user.create({
            user_name: "fedenormaluser",
            user_password: await passwordHash("pass"),
            user_realname: "Fede",
            user_lastname: "lastname",
            user_dni: 12345678,
            user_birthdate: "10/07/1987",
            user_role: "user"
        });
    });
});

// Get Admin Token
const token = async () => {
    var getToken = await request(app).post("/sign/in").send({
        user_name: "fede",
        user_password: "pass",
    })
    var token = getToken.body.token
    return token
}

// Get User Token
const Usertoken = async () => {
    var getToken = await request(app).post("/sign/in").send({
        user_name: "fedenormaluser",
        user_password: "pass",
    })
    var token = getToken.body.token
    return token
}

// POST (Admin sign up)
describe("🟨 POST /sign/in", () => {

    describe("               ✅✅✅✅✅ 200 ✅✅✅✅✅", () => {

        describe("🔘 LOG ADMIN USER", () => {

            // should respond with a 200 code
            test("should respond with a 200 status code", async () => {
                const response = await request(app)
                    .post("/sign/in")
                    .send({
                        user_name: "fede",
                        user_password: "pass",
                    })
                expect(response.statusCode).toBe(200);
            });

            // shoud respond with a json object containsing the new user with an id
            test("should respond with the right token", async () => {
                const response = await request(app)
                    .post("/sign/in")
                    .send({
                        user_name: "fede",
                        user_password: "pass",
                    });
                expect(response.body).toEqual({ "token": await token() })
            });

            // should respond a json as a content type
            test("should have a Content-Type: application/json header", async () => {
                const response = await request(app)
                    .post("/sign/in")
                    .send({
                        user_name: "fede",
                        user_password: "pass"
                    });
                expect(response.headers["content-type"]).toEqual(
                    expect.stringContaining("json")
                );
            });
        });

        describe("🔘 LOG USER", () => {

            // should respond with a 200 code
            test("should respond with a 200 status code", async () => {
                const response = await request(app)
                    .post("/sign/in")
                    .send({
                        user_name: "fedenormaluser",
                        user_password: "pass",
                    })
                expect(response.statusCode).toBe(200);
            });

            // shoud respond with a json object containsing the new user with an id
            test("should respond with the right token", async () => {
                const response = await request(app)
                    .post("/sign/in")
                    .send({
                        user_name: "fedenormaluser",
                        user_password: "pass",
                    });
                expect(response.body).toEqual({ "token": await Usertoken() })
            });

            // should respond a json as a content type
            test("should have a Content-Type: application/json header", async () => {
                const response = await request(app)
                    .post("/sign/in")
                    .send({
                        user_name: "fedenormaluser",
                        user_password: "pass"
                    });
                expect(response.headers["content-type"]).toEqual(
                    expect.stringContaining("json")
                );
            });
        });
    });

    describe("              ❌❌❌❌❌ 40X ❌❌❌❌❌", () => {

        // Missing user information respond with 400 code

        describe("🔘 MISSING FIELD", () => {

            describe("when some field is missing", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const fields = [
                        { user_name: "fede" },
                        { user_password: "pass" },
                        {}
                    ]
                    for (const body of fields) {
                        const response = await request(app)
                            .post("/sign/in")
                            .send(body);
                        expect(response.status).toBe(400)
                    }
                });
            });
        });

        //--------------------------------USERNAME

        describe("🔘 USERNAME:", () => {

            describe("when username is missing", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/in")
                        .send({
                            user_name: "",
                            user_password: "pass",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The username field must be completed" })
                });
            });

            describe("when username is empty", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/in")
                        .send({
                            user_name: "",
                            user_password: "pass",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The username field must be completed" })
                });
            });
        });

        // ---------------------------PASSWORD

        describe("🔘 PASSWORD:", () => {

            describe("when password is missing", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/in")
                        .send({
                            user_name: "isusername414"
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The password field must be completed" })
                });
            });

            describe("when password is empty", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/in")
                        .send({
                            user_name: "isusername414",
                            user_password: "",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The password field must be completed" })
                });
            });
        });

        // ---------------------------CREATE USER

        describe("🔘 LOGIN being LOGGED:", () => {

            describe("when the user is logged as 'admin'", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/in")
                        .set({ 'Authorization': `Bearer ${await token()}` })
                        .send({
                            user_name: "isuseramead5",
                            user_password: "pass",
                        })
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "You are already logged" })
                });
            });

            describe("when the user is logged as 'user'", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/in")
                        .set({ 'Authorization': `Bearer ${await Usertoken()}` })
                        .send({
                            user_name: "isusernam5",
                            user_password: "pass",
                        })
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "You are already logged" })
                });
            });
        });
    });
});

describe("DATABASE END", () => {

    // Database cleaner
    describe("Clean database", () => {
        test("", async () => {
            await user.sync({
                force: true
            });
        })
    });
});

afterAll((done) => {
    testServer.close()
    done()
})