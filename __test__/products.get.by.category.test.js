const request = require('supertest')
const app = require('../app')
const { passwordHash } = require('../src/helpers/bcrypt')
const { product } = require("../src/models")
const { user } = require("../src/models")

let testServer
beforeAll(() => {
    testServer = app.listen(3000)
})

describe("DATABASE INIT", () => {

    // Product table cleaner
    test("Clean database", async () => {
        await product.sync({
            force: true
        });
    })

    // User table cleaner
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
            user_email: "10/07/1987",
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
            user_email: "10/07/1987",
            user_role: "user"
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
            prod_published: false
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

// GET 
describe("GET /products/category", () => {

    describe("               ✅✅✅✅✅ 200 ✅✅✅✅✅", () => {

        describe("🔘 GET PRODUCT:", () => {

            // set category

            describe("With an existing category", () => {
                const category = "toys"

                test("should respond with a 200 status code", async () => {
                    const response = await request(app).get(`/products/category/${category}`);
                    expect(response.statusCode).toBe(200);
                });

                test("should respond an array", async () => {
                    const response = await request(app).get(`/products/category/${category}`)
                    expect(response.body).toBeInstanceOf(Object);
                });

                // // shoud respond with a json object containsing the new user with an category
                // test("should respond with the product by category", async () => {
                //     const getProduct = await product.findAll({ where: { prod_category: category }, attributes: ['prod_name', 'prod_user_category', 'prod_price', 'prod_stock', 'prod_category'] })
                //     const response = await request(app).get(`/products/category/${category}`)
                //     expect(response.body).toEqual({ "Product": getProduct.dataValues })
                // });

                // should respond a json as a content type
                test("should have a Content-Type: application/json header", async () => {
                    const response = await request(app).get(`/products/category/${category}`)
                    expect(response.headers["content-type"]).toEqual(
                        expect.stringContaining("json")
                    );
                });

                test("should a message if category is empty and 200 status code", async () => {
                    const category = "tools"
                    const response = await request(app).get(`/products/category/${category}`)
                    expect(response.status).toBe(200)
                    expect(response.body).toEqual({ "Message": "There is no products from that category" })
                });
            });

            describe("Get products being logged as 'admin'", () => {
                const category = "toys"
                test("should respond with a 200 status code", async () => {
                    const response = await request(app).get(`/products/category/${category}`)
                        .set({ 'Authorization': `Bearer ${await token()}` })
                    expect(response.statusCode).toBe(200);
                });

                test("should respond an array", async () => {
                    const response = await request(app).get(`/products/category/${category}`)
                        .set({ 'Authorization': `Bearer ${await token()}` })
                    expect(response.body).toBeInstanceOf(Object);
                });

                test("should have a Content-Type: application/json header", async () => {
                    const response = await request(app).get(`/products/category/${category}`)
                        .set({ 'Authorization': `Bearer ${await token()}` })
                    expect(response.headers["content-type"]).toEqual(
                        expect.stringContaining("json")
                    );
                });

                test("should a message if category is empty and 200 status code", async () => {
                    const category = "tools"
                    const response = await request(app).get(`/products/category/${category}`)
                        .set({ 'Authorization': `Bearer ${await token()}` })
                    expect(response.status).toBe(200)
                    expect(response.body).toEqual({ "Message": "There is no products from that category" })
                });
            });



            describe("Get products being logged as 'user'", () => {
                const category = "toys"
                test("should respond with a 200 status code", async () => {
                    const response = await request(app).get(`/products/category/${category}`)
                        .set({ 'Authorization': `Bearer ${await Usertoken()}` })
                        .send();
                    expect(response.statusCode).toBe(200);
                });

                test("should respond an array", async () => {
                    const response = await request(app).get(`/products/category/${category}`)
                        .set({ 'Authorization': `Bearer ${await Usertoken()}` })
                    expect(response.body).toBeInstanceOf(Object);
                });

                test("should have a Content-Type: application/json header", async () => {
                    const response = await request(app).get(`/products/category/${category}`)
                        .set({ 'Authorization': `Bearer ${await Usertoken()}` })
                    expect(response.headers["content-type"]).toEqual(
                        expect.stringContaining("json")
                    );
                });

                test("should a message if category is empty and 200 status code", async () => {
                    const category = "tools"
                    const response = await request(app).get(`/products/category/${category}`)
                        .set({ 'Authorization': `Bearer ${await Usertoken()}` })
                    expect(response.status).toBe(200)
                    expect(response.body).toEqual({ "Message": "There is no products from that category" })
                });
            });
        });
    });

    describe("              ❌❌❌❌❌ 40X ❌❌❌❌❌", () => {

        describe("🔘 PRODUCT category:", () => {

            describe("when category doesnt exists", () => {
                const category = "asdvd"
                test("should respond with a 400 status code and the type of error", async () => {
                    const response = await request(app).get(`/products/category/${category}`)
                    expect(response.status).toBe(400)
                    expect(response.body).toEqual({ "Error": "The category does not exist" })
                });
            });
        });
    });
});

describe("DATABASE END", () => {

    // Product table cleaner
    test("Clean database", async () => {
        await product.sync({
            force: true
        });
    })

    // User table cleaner
    test("Clean database", async () => {
        await user.sync({
            force: true
        });
    })
})

afterAll((done) => {
    testServer.close()
    done()
})