const { product } = require("../models");
const { user } = require("../models");

//Get all products
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

// Get product
const getProduct = async (req, res) => {
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

//Get products by category
const getProdByCategory = async (req, res) => {
    try {
        const {limit,offset} = req.body
        const prod_category = req.params.category
        const getProduct = await product.findAll({ where: { prod_category }, limit:limit, offset:offset, attributes: ['prod_name', 'prod_user_id', 'prod_price', 'prod_stock', 'prod_category'] })
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
        const {limit, offset} = req.body
        const getProducts = await product.findAll({ where: { prod_user_id }, limit:limit,offset:offset, attributes: ['prod_name', 'prod_user_id', 'prod_price', 'prod_stock', 'prod_category'] })
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
// Check admin (next)
const saveProductOrAdmin = async (req, res) => {
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
const updateProductOrAdmin = async (req, res, next) => {
    try {
        const product_id = req.params.id
        const user_id = req.user.id
        const getProduct = await product.findOne({ where: { id: product_id } })
        const getUser = await user.findOne({ where: { id: user_id } })
        if (getProduct) {
            const prod_user_id = getProduct.prod_user_id
            if (getUser.user_role == "admin") {
                next()
            }
            else if(user_id == prod_user_id) {
                const { prod_name, prod_price, prod_stock, prod_category, prod_published } = req.body
                await product.update({
                    prod_name,
                    prod_price,
                    prod_stock,
                    prod_category,
                    prod_published
                }, {
                    where: { id:product_id }
                })
                res.status(200).json({ prod_name, prod_user_id , prod_price, prod_stock, prod_category,prod_published  })
            }
            else{
                res.status(401).send('That is not your product')
            }
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
// Check admin
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
    saveProductOrAdmin,
    updateProductOrAdmin,
    deleteProduct
}