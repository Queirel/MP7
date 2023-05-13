/** @format */

const request = require("supertest");
const app = require("../app");
const { passwordHash } = require("../src/helpers/bcrypt");
const { product } = require("../src/models");
const { user } = require("../src/models");

let testServer;
beforeAll(() => {
  testServer = app.listen(3000);
});

describe("DATABASE INIT", () => {
  // Product table cleaner
  test("Clean database", async () => {
    await product.sync({
      force: true,
    });
  });

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
      user_address: "someAdress",
      user_customer_id: "someCustomerId",
      user_role: "user",
    });
  });

  // Create Product
  test("Create Product", async () => {
    await product.create({
      prod_name: "product",
      prod_user_id: 1,
      prod_price: 100,
      prod_stock: 12,
      prod_category: "toys",
    });
  });

  // Create a not published Product
  test("Create a not published Product", async () => {
    await product.create({
      prod_name: "product",
      prod_user_id: 1,
      prod_price: 100,
      prod_stock: 12,
      prod_category: "toys",
      prod_published: false,
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
describe("GET /products", () => {
  describe("               ✅✅✅✅✅ 200 ✅✅✅✅✅", () => {
    describe("🔘 GET PRODUCTS", () => {
      describe("Getting products not logged", () => {
        test("should respond with a 200 status code", async () => {
          const response = await request(app).get("/products").send();
          expect(response.statusCode).toBe(200);
        });

        test("should respond an array", async () => {
          const response = await request(app).get("/products").send();
          expect(response.body).toBeInstanceOf(Object);
        });

        // // should respond with the published products array
        // test("should respond with the published products array", async () => {
        //     const getProds = await product.findAll({ attributes: ['prod_name', 'prod_user_id', 'prod_price', 'prod_stock', 'prod_category'], where: { prod_published: true } })
        //     const response = await request(app).get("/products").send();
        //     expect(response.body).toEqual({ "Products": getProds })
        // });

        // should respond a json as a content type
        test("should have a Content-Type: application/json header", async () => {
          const response = await request(app).get("/products").send();
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("json")
          );
        });
      });
      describe("Get products being logged as 'admin'", () => {
        test("should respond with a 200 status code", async () => {
          const response = await request(app)
            .get(`/products`)
            .set({ Authorization: `Bearer ${await token()}` })
            .send();
          expect(response.statusCode).toBe(200);
        });
        test("should respond an array", async () => {
          const response = await request(app)
            .get(`/products`)
            .set({ Authorization: `Bearer ${await token()}` })
            .send();
          expect(response.body).toBeInstanceOf(Object);
        });
        test("should have a Content-Type: application/json header", async () => {
          const response = await request(app)
            .get(`/products`)
            .set({ Authorization: `Bearer ${await token()}` })
            .send();
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("json")
          );
        });
      });

      describe("Get products being logged as 'user'", () => {
        test("should respond with a 200 status code", async () => {
          const response = await request(app)
            .get(`/products`)
            .set({ Authorization: `Bearer ${await Usertoken()}` })
            .send();
          expect(response.statusCode).toBe(200);
        });

        test("should respond an array", async () => {
          const response = await request(app)
            .get(`/products`)
            .set({ Authorization: `Bearer ${await Usertoken()}` })
            .send();
          expect(response.body).toBeInstanceOf(Object);
        });

        test("should have a Content-Type: application/json header", async () => {
          const response = await request(app)
            .get(`/products`)
            .set({ Authorization: `Bearer ${await Usertoken()}` })
            .send();
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("json")
          );
        });
      });
    });
  });
});

describe("DATABASE END", () => {
  // Product table cleaner
  test("Clean database", async () => {
    await product.sync({
      force: true,
    });
  });

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
