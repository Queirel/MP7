const request = require('supertest')
const app = require('../app')
const { passwordHash, passwordCompare } = require('../src/helpers/bcrypt')
const { user } = require("../src/models")

let testServer
beforeAll(async () => {
    testServer = app.listen(31000)
})

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

// Create User
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

// POST (Sign up)
describe("🟨 POST /sign/up", () => {

    describe("               ✅✅✅✅✅ 200 ✅✅✅✅✅", () => {

        describe("🔘 CREATE USER", () => {

            // should respond with a 200 code
            test("should respond with a 200 status code", async () => {
                const response = await request(app)
                    .post("/sign/up")
                    .send({
                        user_name: "isusername50",
                        user_password: "pass",
                        user_realname: "name",
                        user_lastname: "lastname",
                        user_dni: 12345678,
                        user_birthdate: "10/07/1987",
                    })
                expect(response.statusCode).toBe(200);
            });

            // should be the same information
            test("should return same user data from database", async () => {
                const User = {
                    user_name: "is7rname50",
                    user_password: "pass",
                    user_realname: "name",
                    user_lastname: "lastname",
                    user_dni: 12345678,
                    user_birthdate: "10/07/1987",
                }
                await request(app)
                    .post("/sign/up")
                    .send(User)
                const getUser = await user.findOne({ where: { user_name: "is7rname50" } })
                expect(getUser).toBeDefined()
                expect(getUser.id).toBeDefined()
                expect(getUser.user_name).toBe(User.user_name)
                expect(await passwordCompare(User.user_password, getUser.user_password)).toBe(true)
                expect(getUser.user_realname).toBe(User.user_realname)
                expect(getUser.user_lastname).toBe(User.user_lastname)
                expect(getUser.user_dni).toBe(User.user_dni)
                expect(getUser.user_birthdate).toBe(User.user_birthdate)
                expect(getUser.user_role).toBe('user')
            });

            // shoud respond with a json object containsing the new user with an id
            test("should respond with an ID", async () => {
                const response = await request(app)
                    .post("/sign/up")
                    .send({
                        user_name: "isusername51",
                        user_password: "pass",
                        user_realname: "name",
                        user_lastname: "lastname",
                        user_dni: 12345678,
                        user_birthdate: "10/07/1987",
                    });
                expect(response.body.id).toBeDefined();
            });

            // should respond a json as a content type
            test("should have a Content-Type: application/json header", async () => {
                const response = await request(app)
                    .post("/sign/up")
                    .send({
                        user_name: "isusername43",
                        user_password: "pass",
                        user_realname: "name",
                        user_lastname: "lastname",
                        user_dni: 12345678,
                        user_birthdate: "10/07/1987",
                    });
                expect(response.headers["content-type"]).toEqual(
                    expect.stringContaining("json")
                );
            });
        });

        //--------------------------------USERNAME

        describe("🔘 USERNAME:", () => {

            describe("username contains only numbers", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "is12345",
                            user_password: "pass",
                            user_realname: "name",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.statusCode).toBe(200);
                });
            });

            describe("username contains only letters", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername4",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(200);
                });
            });

            describe("username contains numbers and letters", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername4123",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(200);
                });
            });

            describe("username contains up to 14 characters", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "user1234567890",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(200);
                });
            });

            describe("username contains 3 characters", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusr",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(200);
                });
            });
        });

        //--------------------------------NAME

        describe("🔘 NAME:", () => {

            describe("name contains only letters", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername422",
                            user_password: "pass",
                            user_realname: "name",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.statusCode).toBe(200);
                });
            });

            describe("name contains up to 14 characters", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername423",
                            user_password: "pass",
                            user_realname: "nombrefederico",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(200);
                });
            });

            describe("name contains 3 characters", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername424",
                            user_password: "pass",
                            user_realname: "fed",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(200);
                });
            });
        });

        //--------------------------------LASTNAME

        describe("🔘 LASTNAME:", () => {

            describe("lastname contains only letters", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername425",
                            user_password: "pass",
                            user_realname: "fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.statusCode).toBe(200);
                });
            });

            describe("lastname contains up to 14 characters", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername426",
                            user_password: "pass",
                            user_realname: "fede",
                            user_lastname: "itismylastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(200);
                });
            });

            describe("lastname contains 2 characters", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername427",
                            user_password: "pass",
                            user_realname: "fede",
                            user_lastname: "li",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(200);
                });
            });
        });

        //--------------------------------USER DNI

        describe("🔘 USER DNI:", () => {

            describe("user dni contains only numbers", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername428",
                            user_password: "pass",
                            user_realname: "fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.statusCode).toBe(200);
                });
            });

            describe("user dni contains up to 10 numbers", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername429",
                            user_password: "pass",
                            user_realname: "fede",
                            user_lastname: "itismylastname",
                            user_dni: 1234567890,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(200);
                });
            });

            describe("user dni contains 8 numbers", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername430",
                            user_password: "pass",
                            user_realname: "fede",
                            user_lastname: "li",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(200);
                });
            });
        });

        //--------------------------------PASSWORD

        describe("🔘 PASSWORD:", () => {

            describe("password contains only numbers", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername431",
                            user_password: "12345",
                            user_realname: "fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.statusCode).toBe(200);
                });
            });

            describe("password contains only letters", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername432",
                            user_password: "password",
                            user_realname: "fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.statusCode).toBe(200);
                });
            });

            describe("password contains only simbols", () => {
                test("should respond with a 200 status code", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername433",
                            user_password: "!#$%&/=)(/",
                            user_realname: "fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.statusCode).toBe(200);
                });
            });

            describe("password contains numbers, letters and simbols", () => {
                test("should respond with a 200 status", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername434",
                            user_password: "pass.1234!!",
                            user_realname: "fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.statusCode).toBe(200);
                });
            });

            describe("password contains up to 30 characters", () => {
                test("should respond with a 200 status", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername435",
                            user_password: "ispassword12345678901234567890",
                            user_realname: "fede",
                            user_lastname: "lastname",
                            user_dni: 1234567890,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(200);
                });
            });

            describe("password contains 4 characters", () => {
                test("should respond with a 200 status", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername436",
                            user_password: "pass",
                            user_realname: "fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(200);
                });
            });
        });
    });
    describe("              ❌❌❌❌❌ 40X ❌❌❌❌❌", () => {

        // Missing user information respond with 400 code

        describe("🔘 CREATE USER", () => {

            describe("when some field is missing", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const fields = [
                        { user_name: "isuserdfsncb" },
                        { user_password: "pass" },
                        { user_realname: "Fede" },
                        { user_lastname: "lastname" },
                        { user_dni: 12345678 },
                        { user_birthdate: "10/07/1987" },
                        {}
                    ]
                    for (const body of fields) {
                        const response = await request(app)
                            .post("/sign/up")
                            .send(body);
                        expect(response.status).toBe(400)
                    }
                });
            });
        });

        //--------------------------------USERNAME

        describe("🔘 USERNAME:", () => {

            describe("when the unique username is repeated", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "fede",
                            user_password: "pass",
                            user_realname: "name",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.statusCode).toBe(400)
                    expect(response.body).toEqual({ "Error": "The username alredy exists" })
                });
            });

            describe("when username not contains only letters and/or numbers", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isuser.name12!",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The username must be only letters and numbers" })
                });
            });

            describe("when username not contains at least 3 characters", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "u2",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The username must be at least 3 characters" })
                });
            });

            describe("when username its empty", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The username field must be completed" })
                });
            });

            describe("when username not contains less than 15 characters", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "itistheusername",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The username must be less than 15 characters" })
                });
            });
        });

        // ---------------------------NAME

        describe("🔘 NAME:", () => {

            describe("when name not contains only letters", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername44",
                            user_password: "pass",
                            user_realname: "fede12",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The name must be only letters" })
                });
            });

            describe("when name its empty", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername45",
                            user_password: "pass",
                            user_realname: "",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The name field must be completed" })
                });
            });

            describe("when name not contains at least 3 characters", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername45",
                            user_password: "pass",
                            user_realname: "fd",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The name must be at least 3 letters" })
                });
            });

            describe("when name not contains less than 15 characters", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername46",
                            user_password: "pass",
                            user_realname: "thisisthenameoftheuser",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The name must be less than 15 characters" })
                });
            });
        });

        // ---------------------------LASTNAME

        describe("🔘 LASTNAME:", () => {

            describe("when lastname not contains only letters", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername47",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "last.name22",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The lastname must be only letters" })
                });
            });

            describe("when lastname not contains at least 2 characters", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername48",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "q",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The lastname must be at least 2 letters" })
                });
            });

            describe("when lastname its empty", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername45",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The lastname field must be completed" })
                });
            });

            describe("when lastname not contains less than 15 characters", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername49",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "thisisthelastnameoftheuser",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The lastname must be less than 15 characters" })
                });
            });
        });

        // ---------------------------USER DNI

        describe("🔘 USER DNI:", () => {

            describe("when user dni not contains only numbers", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername410",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: "123456ad8",
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "DNI must be an integer" })
                });
            });

            describe("when user dni not contains at least 8 numbers", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername411",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: 1234567,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "DNI must be at least 8 numbers" })
                });
            });

            describe("when user dni its empty", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername412",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: "",
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The DNI field must be completed" })
                });
            });

            describe("when user dni not contains at most 10 numbers", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername413",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: 12345678910,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "DNI must be at most 10 numbers" })
                });
            });
        });

        // ---------------------------PASSWORD

        describe("🔘 PASSWORD:", () => {

            describe("when password its empty", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername414",
                            user_password: "",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The password field must be completed" })
                });
            });

            describe("when password not contains at most 30 characters", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername415",
                            user_password: "abcdefg123456789012345678901234567890",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "Password must be at most 30 characters" })
                })
            });

            describe("when password not contains at least 4 characters", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .send({
                            user_name: "isusername416",
                            user_password: "pas",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        });
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "Password must be at least 4 characters" })
                })
            });
        });

        // ---------------------------CREATE USER

        describe("🔘 CREATE USER:", () => {

            describe("when the user is logged", () => {
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app)
                        .post("/sign/up")
                        .set({ 'Authorization': `Bearer ${await Usertoken()}` })
                        .send({
                            user_name: "isu34rnamead5",
                            user_password: "pass",
                            user_realname: "Fede",
                            user_lastname: "lastname",
                            user_dni: 12345678,
                            user_birthdate: "10/07/1987",
                        })
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "You are already logged" })
                });
            });
        });
    });
});

// Database cleaner
describe("Clean database", () => {
    test("", async () => {
        await user.sync({
            force: true
        });
    })
});

afterAll((done) => {
    testServer.close()
    done()
})