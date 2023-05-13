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

  // Create Product (Admin)
  test("Create Product", async () => {
    await product.create({
      prod_name: "product",
      prod_user_id: 1,
      prod_price: 100,
      prod_stock: 12,
      prod_category: "toys",
    });

    await product.create({
      prod_name: "product",
      prod_user_id: 1,
      prod_price: 100,
      prod_stock: 12,
      prod_category: "toys",
    });

    await product.create({
      prod_name: "product",
      prod_user_id: 1,
      prod_price: 100,
      prod_stock: 12,
      prod_category: "toys",
    });

    await product.create({
      prod_name: "product",
      prod_user_id: 1,
      prod_price: 100,
      prod_stock: 12,
      prod_category: "toys",
    });

    await product.create({
      prod_name: "product",
      prod_user_id: 1,
      prod_price: 100,
      prod_stock: 12,
      prod_category: "toys",
    });
  });

  // Create Product (User)
  test("Create Product", async () => {
    await product.create({
      prod_name: "product",
      prod_user_id: 2,
      prod_price: 100,
      prod_stock: 12,
      prod_category: "toys",
    });

    await product.create({
      prod_name: "product",
      prod_user_id: 2,
      prod_price: 100,
      prod_stock: 12,
      prod_category: "toys",
    });

    await product.create({
      prod_name: "product",
      prod_user_id: 2,
      prod_price: 100,
      prod_stock: 12,
      prod_category: "toys",
    });

    await product.create({
      prod_name: "product",
      prod_user_id: 2,
      prod_price: 100,
      prod_stock: 12,
      prod_category: "toys",
    });

    await product.create({
      prod_name: "product",
      prod_user_id: 2,
      prod_price: 100,
      prod_stock: 12,
      prod_category: "toys",
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

// delete
describe("DELETE /products/id", () => {
  describe("🔘 PRODUCT ID (USER):", () => {
    describe("Delete with an existing own id being 'user'", () => {
      const id = 9;
      test("should respond with a 200 status code and the message", async () => {
        const response = await request(app)
          .delete(`/products/${id}`)
          .send()
          .set({ Authorization: `Bearer ${await Usertoken()}` });
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ Message: `Product ${id} deleted` });
      });
    });

    describe("when id is not an integer (User)", () => {
      const id = "asd";
      test("should respond with a 400 status code and the type of error", async () => {
        const response = await request(app)
          .delete(`/products/${id}`)
          .send()
          .set({ Authorization: `Bearer ${await Usertoken()}` });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          Error: "Product id must be an integer",
        });
      });
    });

    describe("when product doesn exist with the id (User)", () => {
      const id = 123;
      test("should respond with a 400 status code and the type of error", async () => {
        const response = await request(app)
          .delete(`/products/${id}`)
          .send()
          .set({ Authorization: `Bearer ${await Usertoken()}` });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ Error: "Product does not exist" });
      });
    });

    describe("when is not an own product (user)", () => {
      const id = 2;
      test("should respond with a 400 status code and the type of error", async () => {
        const response = await request(app)
          .delete(`/products/${id}`)
          .send()
          .set({ Authorization: `Bearer ${await Usertoken()}` });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ Forbidden: "you do not have access" });
      });
    });
  });

  describe("🔘 PRODUCT ID (ADMIN):", () => {
    describe("Delete with an existing own id being 'admin'", () => {
      const id = 1;
      test("should respond with a 200 status code and the message", async () => {
        const response = await request(app)
          .delete(`/products/${id}`)
          .send()
          .set({ Authorization: `Bearer ${await token()}` });
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ Message: `Product ${id} deleted` });
      });
    });

    describe("when id is not an integer (admin)", () => {
      const id = "asd";
      test("should respond with a 400 status code and the type of error", async () => {
        const response = await request(app)
          .delete(`/products/${id}`)
          .send()
          .set({ Authorization: `Bearer ${await token()}` });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          Error: "Product id must be an integer",
        });
      });
    });

    describe("when product doesn exist with the id (admin)", () => {
      const id = 123;
      test("should respond with a 400 status code and the type of error", async () => {
        const response = await request(app)
          .delete(`/products/${id}`)
          .send()
          .set({ Authorization: `Bearer ${await token()}` });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ Error: "Product does not exist" });
      });
    });

    describe("when is not an own product (admin)", () => {
      const id = 6;
      test("should respond with a 400 status code and the type of error", async () => {
        const response = await request(app)
          .delete(`/products/${id}`)
          .send()
          .set({ Authorization: `Bearer ${await token()}` });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ Forbidden: "you do not have access" });
      });
    });
  });

  describe("🔘 PRODUCT ID (NON LOG):", () => {
    describe("when is a non logged user", () => {
      const id = 7;
      test("should respond with a 400 status code and the type of error", async () => {
        const response = await request(app).delete(`/products/${id}`).send();
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ Error: "You must be logged" });
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
