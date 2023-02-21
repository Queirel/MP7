const { product } = require("../models");

const getProducts = async (req, res) => {
    try {
        const { offset, limit } = req.body
        const getProds = await product.findAll({ attributes: ['prod_name', 'prod_user_id', 'prod_price', 'prod_stock', 'prod_category'], where: { prod_published: true }, offset: offset, limit: limit })
        res.status(200).json({ "Productos": getProds })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

const getProductById = async (req, res) => {
    try {
        const id = req.params.id
        const getProduct = await product.findOne({ where: { id }, attributes: ['prod_name', 'prod_user_id', 'prod_price', 'prod_stock', 'prod_category'] })
        if (getProduct) {
            res.status(200).json(getProduct)
        }
        else {
            res.status(404).send('Product does not exist')
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

const getProdByCategory = async (req, res) => {
    try {
        // TODO: Controlar que la categoria exista
        const { limit, offset } = req.body
        const prod_category = req.params.category
        const getProduct = await product.findAll({ where: { prod_category }, limit: limit, offset: offset, attributes: ['prod_name', 'prod_user_id', 'prod_price', 'prod_stock', 'prod_category'] })
        if (!getProduct.length == 0) {
            res.status(200).json(getProduct)
        }
        else {
            res.status(404).send('There is no products from that category')
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

const getProductByUserId = async (req, res) => {
    try {
        const prod_user_id = req.params.id
        const { limit, offset } = req.body
        const getProducts = await product.findAll({ where: { prod_user_id }, limit: limit, offset: offset, attributes: ['prod_name', 'prod_user_id', 'prod_price', 'prod_stock', 'prod_category'] })
        if (!getProducts.length == 0) {
            res.status(200).json(getProducts)
        }
        else {
            res.status(404).send('There is no products from the user')
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Save a product
const saveProduct = async (req, res) => {
    try {
        const user_id = req.user.id
        const { prod_name, prod_price, prod_stock, prod_category } = req.body
        if (prod_stock <= 0) {
            res.status(400).json({ "Error": "Stock must be more than 0" })
            brake
        }
        else if (prod_stock > 1000) {
            res.status(400).json({ "Error": "Stock must be less than 1001" })
        }
        else if (isNaN(prod_stock)) {
            res.status(400).json({ "Error": "Stock must be a number" })
        }
        else {
            const saveProduct = await product.create({
                prod_name,
                prod_user_id: user_id,
                prod_price,
                prod_stock,
                prod_category
            })
            res.status(200).json(saveProduct)
        }
    }
    catch (err) {
        res.status(500).json({"Error":"An unexpected error occurred. please try again later"})
        console.log(err.message)
        // return res.status(500).render('errors/500', err.message);

    }
}

// Update an own product
const updateProduct = async (req, res) => {
    try {
        const product_id = req.params.id
        const getProduct = await product.findOne({ where: { id: product_id } })
        const { prod_name, prod_price, prod_stock, prod_category, prod_published } = req.body
        if (!prod_name) {
            getProd_name = getProduct.dataValues.prod_name
        }
        else {
            getProd_name = prod_name
        }
        if (!prod_price) {
            getProd_price = getProduct.dataValues.prod_price
        }
        else {
            getProd_price = prod_price
        }
        if (!prod_stock) {
            getProd_stock = getProduct.dataValues.prod_stock
        }
        else {
            getProd_stock = prod_stock
        }
        if (!prod_category) {
            getProd_category = getProduct.dataValues.prod_category
        }
        else {
            getProd_category = prod_category
        }
        if (!prod_published) {
            getProd_published = getProduct.dataValues.prod_published
        }
        else {
            getProd_published = prod_published
        }
        await product.update({
            prod_name: getProd_name,
            prod_price: getProd_price,
            prod_stock: getProd_stock,
            prod_category: getProd_category,
            prod_published: getProd_published
        }, {
            where: { id: product_id }
        })
        res.status(200).json({
            "Id": product_id,
            "Product name": getProd_name,
            "Product price": getProd_price,
            "Product stock": getProd_stock,
            "Product category": getProd_category,
            "Product published": getProd_published
        })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Delete an own product
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id
        const getProduct = await product.findOne({ where: { id } })
        if (getProduct) {
            await product.destroy({ where: { id } })
            res.status(200).json(`Product ${id} deleted`)
        }
        else {
            res.status(404).send('Product does not exists')
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

module.exports = {
    getProducts,
    getProductById,
    getProdByCategory,
    getProductByUserId,
    saveProduct,
    updateProduct,
    deleteProduct
}