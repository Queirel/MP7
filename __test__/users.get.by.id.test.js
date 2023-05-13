/** @format */

const request = require("supertest");
const app = require("../app");
const { passwordHash } = require("../src/helpers/bcrypt");
const { user } = require("../src/models");

let testServer;
beforeAll(() => {
  testServer = app.listen(3000);
});

describe("DATABASE INIT", () => {
  // User table cleaner
  test("Clean database", async () => {
    await user.sync({
      force: true,
    });
  });

  // Create Admin
  test("Create Admin", async () => {
    await user.create({
      user_name: "fede",
      user_password: await passwordHash("pass"),
      user_realname: "Fede",
      user_lastname: "lastname",
      user_dni: 12345678,
      user_email: "email@mail.com",
      user_role: "admin",
      user_address: "someAdress",
      user_customer_id: "someCustomerId",
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
      user_email: "email@mail.com",
      user_role: "user",
      user_address: "someAdress",
      user_customer_id: "someCustomerId",
    });
  });
});

// Get Admin Token
const token = async () => {
  var getToken = await request(app).post("/sign/in").send({
    user_name: "fede",
    user_password: "pass",
  });
  var token = getToken.body.token;
  return token;
};

// Get User Token
const Usertoken = async () => {
  var getToken = await request(app).post("/sign/in").send({
    user_name: "fedenormaluser",
    user_password: "pass",
  });
  var token = getToken.body.token;
  return token;
};

// GET
describe("GET /users/id", () => {
  describe("🔘 GET USER:", () => {
    // set id
    const id = 1;

    describe("Get user (not log)", () => {
      test("should respond with a 200 status code", async () => {
        const response = await request(app).get(`/users/${id}`).send();
        expect(response.statusCode).toBe(200);
      });

      test("should respond an object", async () => {
        const response = await request(app).get(`/users/${id}`).send();
        expect(response.body).toBeInstanceOf(Object);
      });

      // shoud respond with a json object containsing the new user with an id
      test("should respond with the name of the user", async () => {
        const getUser = await user.findOne({ where: { id } });
        const response = await request(app).get(`/users/${id}`).send();
        expect(response.body).toEqual({ "User name": getUser.user_name });
      });

      // should respond a json as a content type
      test("should have a Content-Type: application/json header", async () => {
        const response = await request(app).get(`/users/${id}`).send();
        expect(response.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      });
    });

    describe("Get user being logged as 'admin'", () => {
      test("should have a Content-Type: application/json header", async () => {
        const response = await request(app)
          .get(`/users/${id}`)
          .set({ Authorization: `Bearer ${await token()}` })
          .send();
        expect(response.statusCode).toBe(200);
      });

      test("should respond an object", async () => {
        const response = await request(app)
          .get(`/users/${id}`)
          .send()
          .set({ Authorization: `Bearer ${await token()}` });
        expect(response.body).toBeInstanceOf(Object);
      });

      // shoud respond with a json object containsing the new user with an id
      test("should respond with the name of the user", async () => {
        const getUser = await user.findOne({ where: { id } });
        const response = await request(app)
          .get(`/users/${id}`)
          .send()
          .set({ Authorization: `Bearer ${await token()}` });
        expect(response.body).toEqual({ "User name": getUser.user_name });
      });

      // should respond a json as a content type
      test("should have a Content-Type: application/json header", async () => {
        const response = await request(app)
          .get(`/users/${id}`)
          .send()
          .set({ Authorization: `Bearer ${await token()}` });
        expect(response.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      });
    });

    describe("Get user being logged as 'user'", () => {
      test("should have a Content-Type: application/json header", async () => {
        const response = await request(app)
          .get(`/users/${id}`)
          .set({ Authorization: `Bearer ${await Usertoken()}` })
          .send();
        expect(response.statusCode).toBe(200);
      });

      test("should respond an object", async () => {
        const response = await request(app)
          .get(`/users/${id}`)
          .send()
          .set({ Authorization: `Bearer ${await Usertoken()}` });
        expect(response.body).toBeInstanceOf(Object);
      });

      // shoud respond with a json object containsing the new user with an id
      test("should respond with the name of the user", async () => {
        const getUser = await user.findOne({ where: { id } });
        const response = await request(app)
          .get(`/users/${id}`)
          .send()
          .set({ Authorization: `Bearer ${await Usertoken()}` });
        expect(response.body).toEqual({ "User name": getUser.user_name });
      });

      // should respond a json as a content type
      test("should have a Content-Type: application/json header", async () => {
        const response = await request(app)
          .get(`/users/${id}`)
          .send()
          .set({ Authorization: `Bearer ${await Usertoken()}` });
        expect(response.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      });
    });
  });

  describe("🔘 user ID:", () => {
    describe("not log", () => {
      describe("when id is not an integer", () => {
        const id = "asd";
        test("should respond with a 400 status code and the type of error", async () => {
          const response = await request(app).get(`/users/${id}`).send();
          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            Error: "User id must be an integer",
          });
        });
      });

      describe("when user doesnt exist with the id", () => {
        const id = 123;
        test("should respond with a 400 status code and the type of error", async () => {
          const response = await request(app).get(`/users/${id}`).send();
          expect(response.status).toBe(400);
          expect(response.body).toEqual({ Error: "User does not exist" });
        });
      });
    });

    describe("Logged as 'user'", () => {
      describe("when id is not an integer", () => {
        const id = "asd";
        test("should respond with a 400 status code and the type of error", async () => {
          const response = await request(app)
            .get(`/users/${id}`)
            .send()
            .set({ Authorization: `Bearer ${await Usertoken()}` });
          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            Error: "User id must be an integer",
          });
        });
      });

      describe("when user doesnt exist with the id", () => {
        const id = 123;
        test("should respond with a 400 status code and the type of error", async () => {
          const response = await request(app)
            .get(`/users/${id}`)
            .send()
            .set({ Authorization: `Bearer ${await Usertoken()}` });
          expect(response.status).toBe(400);
          expect(response.body).toEqual({ Error: "User does not exist" });
        });
      });
    });

    describe("Logged as 'admin'", () => {
      describe("when id is not an integer", () => {
        const id = "asd";
        test("should respond with a 400 status code and the type of error", async () => {
          const response = await request(app)
            .get(`/users/${id}`)
            .send()
            .set({ Authorization: `Bearer ${await token()}` });
          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            Error: "User id must be an integer",
          });
        });
      });

      describe("when user doesnt exist with the id", () => {
        const id = 123;
        test("should respond with a 400 status code and the type of error", async () => {
          const response = await request(app)
            .get(`/users/${id}`)
            .send()
            .set({ Authorization: `Bearer ${await token()}` });
          expect(response.status).toBe(400);
          expect(response.body).toEqual({ Error: "User does not exist" });
        });
      });
    });
  });
});

describe("DATABASE END", () => {
  // User table cleaner
  test("Clean database", async () => {
    await user.sync({
      force: true,
    });
  });
});

afterAll((done) => {
  testServer.close();
  done();
});
