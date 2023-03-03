const dataBases = () =>{

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

// Create user
test("Create User", async () => {
    await user.create({
        user_name: "fede",
        user_password: await passwordHash("pass"),
        user_realname: "Fede",
        user_lastname: "lastname",
        user_dni: 12345678,
        user_birthdate: "10/07/1987",
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


}

module.exports = dataBases