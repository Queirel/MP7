const {product} = require("../models");

//Get all products
const getProducts = async (req, res) => {
    try {
        // { offset: 5, limit: 5 }
        const getProds = await product.findAll()
        res.status(200).json(getProds)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Save a product
const saveProduct = async (req, res) => {
    const { prod_name, prod_user_id, prod_price, prod_stock, prod_category } = req.body
    const saveProduct = await product.create({
        prod_name,
        prod_user_id,
        prod_price,
        prod_stock,
        prod_category
    })
    res.status(200).json(saveProduct)
}

// Get product by user Id
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

// Update an own product
const updateProduct = async (req, res) => {
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

// Get a user's products
const getProductByUserId = async (req, res) => {
    try {
        const prod_user_id = req.params.id
        const product = await product.findAll({ where: { prod_user_id } })
        if (product) {
            res.status(200).json(product)
        }
        else {
            res.status(404).send('There is no products from the user')
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
        console.log(prod_category)
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

module.exports = {
    getProducts,
    saveProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductByUserId,
    getProdByCategory
}