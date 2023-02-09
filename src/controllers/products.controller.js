const { product } = require("../models");

//Get all products
const getProducts = async (req, res) => {
    try {
        const getProds = await product.findAll({ offset: 1, limit: 7 })
        res.status(200).json(getProds)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Get product
const getProduct = async (req, res) => {
    try {
        const id = req.params.id
        const getProduct = await product.findOne({ where: { id } })
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

//Get products by category
const getProdByCategory = async (req, res) => {
    try {
        const prod_category = req.params.category
        const getProduct = await product.findAll({ where: { prod_category } })
        if (getProduct) {
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

// Get a products by user_id
const getProductByUserId = async (req, res) => {
    try {
        const prod_user_id = req.params.id
        const getProducts = await product.findAll({ where: { prod_user_id } })
        if (getProducts) {
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
// Check admin (next)
const saveProduct = async (req, res) => {
    try {
        const user_id = req.user.id
        const { prod_name, prod_price, prod_stock, prod_category } = req.body
        const saveProduct = await product.create({
            prod_name,
            prod_user_id: user_id,
            prod_price,
            prod_stock,
            prod_category
        })
        res.status(200).json(saveProduct)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Update an own product
// Check admin (next)
const updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id
        const getProduct = await product.findOne({ where: { id } })
        if (getProduct) {
            const { prod_name, prod_user_id, prod_price, prod_stock, prod_category } = req.body
            await product.update({
                prod_name,
                prod_user_id,
                prod_price,
                prod_stock,
                prod_category,
            }, {
                where: { id }
            })
            res.status(200).json({ id, prod_name, prod_user_id, prod_price, prod_stock, prod_category })
        }
        else {
            res.status(404).send('Product does not exists')
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Delete an own product
// Check admin (next)
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
    getProduct,
    getProdByCategory,
    getProductByUserId,
    saveProduct,
    updateProduct,
    deleteProduct
}