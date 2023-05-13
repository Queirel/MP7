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
describe("GET /products/id", () => {
  describe("🔘 GET PRODUCT:", () => {
    // set id
    const id = 1;

    describe("With an existing id", () => {
      test("should respond with a 200 status code", async () => {
        const response = await request(app).get(`/products/${id}`).send();
        expect(response.statusCode).toBe(200);
      });

      test("should respond an object", async () => {
        const response = await request(app).get(`/products/${id}`).send();
        expect(response.body).toBeInstanceOf(Object);
      });

      // shoud respond with a json object containsing the new user with an id
      test("should respond with the product by id", async () => {
        const getProduct = await product.findOne({
          where: { id },
          attributes: [
            "prod_name",
            "prod_user_id",
            "prod_price",
            "prod_stock",
            "prod_category",
            "prod_image",
          ],
        });
        console.log(getProduct.dataValues);
        const response = await request(app).get(`/products/${id}`).send();
        expect(response.body).toEqual({ Product: getProduct.dataValues });
      });

      // should respond a json as a content type
      test("should have a Content-Type: application/json header", async () => {
        const response = await request(app).get(`/products/${id}`).send();
        expect(response.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      });
    });

    describe("when id is not an integer", () => {
      const id = "asd";
      test("should respond with a 400 status code and the type of error", async () => {
        const response = await request(app).get(`/products/${id}`).send();
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          Error: "Product id must be an integer",
        });
      });
    });

    describe("when product doesn exist with the id", () => {
      const id = 123;
      test("should respond with a 400 status code and the type of error", async () => {
        const response = await request(app).get(`/products/${id}`).send();
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ Error: "Product does not exist" });
      });
    });

    describe("Get product being logged as 'admin'", () => {
      test("should have a Content-Type: application/json header", async () => {
        const response = await request(app)
          .get(`/products/${id}`)
          .set({ Authorization: `Bearer ${await token()}` })
          .send();
        expect(response.statusCode).toBe(200);
      });
    });

    describe("Get product being logged as 'user'", () => {
      test("should have a Content-Type: application/json header", async () => {
        const response = await request(app)
          .get(`/products/${id}`)
          .set({ Authorization: `Bearer ${await Usertoken()}` })
          .send();
        expect(response.statusCode).toBe(200);
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
