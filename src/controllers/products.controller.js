const { uploadFile } = require("../helpers/s3");
const { product } = require("../models");
const logger = require("../helpers/logger");
const host = process.env.AWS_BUCKET_HOST

// Get a products
const getProducts = async (req, res) => {
  try {
    // const { offset, limit } = req.body
    const getProds = await product.findAll({
      attributes: [
        "prod_name",
        "prod_user_id",
        "prod_price",
        "prod_stock",
        "prod_category",
        "prod_image"
      ],
      where: { prod_published: true },
      //  offset: offset, limit: limit
    });
    logger.info(`get/products - (got all products)`,{ code: 200, method: "get", route: "/products"})
    res.status(200).json({ Products: getProds });
  } catch (error) {
    logger.error(`get/products - (getting all products) - Error(500): ${error}`,{ code: 500, method: "get", route: "/products"})
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Get a product by id
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    // Product id conditions
    if (!id) {
      logger.warn(`get/products/:id - (Id is missing)`,{ product: req.params.id, code: 400, method: "get", route: "/products/:id"})
      return res.status(400).json({ Error: "Id is missing" });
    }
    if (id == "") {
      logger.warn(`get/products/:id - (id is empty)`,{ product: req.params.id, code: 400, method: "get", route: "/products/:id"})
      return res.status(400).json({ Error: "id is empty" });
    }
    if (/[^0-9]/.test(id)) {
      logger.warn(`get/products/:id - (Product id must be an integer)`,{ product: req.params.id, code: 400, method: "get", route: "/products/:id"})
      return res.status(400).json({ Error: "Product id must be an integer" });
    }

    const getProduct = await product.findOne({
      where: { id },
      attributes: [
        "prod_name",
        "prod_user_id",
        "prod_price",
        "prod_stock",
        "prod_category",
        "prod_image"
      ],
    });
    if (!getProduct) {
      return res.status(400).json({ Error: "Product does not exist" });
    }
    logger.info(`get/products/:id - (getting product ${req.params.id})`,{ product: req.params.id, code: 200, method: "get", route: "/products/:id"})
    res.status(200).json({ Product: getProduct });
  } catch (error) {
    logger.error(`get/products/:id - (getting product ${req.params.id}) - Error(500): ${error}`,{ product: req.params.id, code: 500, method: "get", route: "/products/:id"})
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Get a product by category
const getProdByCategory = async (req, res) => {
  try {
    // const { limit, offset } = req.body
    const prod_category = req.params.category;

    // Category conditions
    const categorys = [
      "agro",
      "fashion",
      "food",
      "home",
      "tecnology",
      "tools",
      "toys",
    ];
    if (!categorys.includes(prod_category)) {
      logger.warn(`get/products/category/:category - (The category does not exist)`,{ products_category: req.params.category, code: 400, method: "get", route: "/products/category/:category"})
      return res.status(400).json({ Error: "The category does not exist" });
    }

    const getProducts = await product.findAll({
      where: { prod_category },
      // limit: limit, offset: offset,
      attributes: [
        "prod_name",
        "prod_user_id",
        "prod_price",
        "prod_stock",
        "prod_category",
        "prod_image"
      ],
    });
    if (getProducts.length == 0) {
      logger.info(`get/products/category/:category - (got products by category: ${req.params.category})`,{ products_category: req.params.category, code: 200, method: "get", route: "/products/category/:category"})
      return res
        .status(200)
        .json({ Message: "There is no products from that category" });
    }

    res.status(200).json({ Product: getProducts });
  } catch (error) {
    logger.error(`get/products/category/:category - (getting products by category: ${req.params.category}) - Error(500): ${error}`,{ products_category: req.params.category, code: 500, method: "get", route: "/products/category/:category"})
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Get a product by user id
const getProductByUserId = async (req, res) => {
  try {
    const prod_user_id = req.params.id;
    const { limit, offset } = req.body;

    // User id conditions
    if (/[^0-9]/.test(prod_user_id)) {
      logger.warn(`get/products/user/:id - (User id must be an integer)`,{ products_user: req.params.id, code: 400, method: "get", route: "/products/user/:id"})
      return res.status(400).json({ Error: "User id must be an integer" });
    }

    const getProducts = await product.findAll({
      where: { prod_user_id },
      limit: limit,
      offset: offset,
      attributes: [
        "prod_name",
        "prod_user_id",
        "prod_price",
        "prod_stock",
        "prod_category",
        "prod_image",
      ],
    });

    if (getProducts.length == 0) {
      logger.info(`get/products/user/:id - (got products by user id: ${req.params.id})`,{ products_user: req.params.id, code: 200, method: "get", route: "/products/user/:id"})
      return res
        .status(200)
        .json({ Message: "There is no products from the user" });
    }
    // logger.info(`get/products/user/:id - (got products by user id: ${req.params.id})`)
    res.status(200).json({ Products: getProducts });
  } catch (error) {
    logger.error(`get/products/user/:id - (getting products by user id: ${req.params.id}) - Error(500): ${error}`,{ products_user: req.params.id, code: 500, method: "get", route: "/products/user/:id"})
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Create a product
const saveProduct = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { prod_name, prod_price, prod_stock, prod_category } = req.body;
    const check_files = req.files;
    var prod_image;

    if (!prod_name) {
      logger.warn(`post/products - (The product name field must be completed)`, { user: req.user.id, code: 400, method: "post", route: "/products"})
      return res
        .status(400)
        .json({ Error: "The product name field must be completed" });
    }

    if (!prod_price) {
      logger.warn(`post/products - (The product price field must be completed)`, { user: req.user.id, code: 400, method: "post", route: "/products"})
      return res
        .status(400)
        .json({ Error: "The product price field must be completed" });
    }

    if (!prod_stock) {
      logger.warn(`post/products - (The product stock field must be completed)`, { user: req.user.id, code: 400, method: "post", route: "/products"})
      return res
        .status(400)
        .json({ Error: "The product stock field must be completed" });
    }

    if (!prod_category) {
      logger.warn(`post/products - (The product category field must be completed)`, { user: req.user.id, code: 400, method: "post", route: "/products"})
      return res
        .status(400)
        .json({ Error: "The product category field must be completed" });
    }

    if (check_files) {
      getFile = req.files.file;
      if (getFile) {
        await uploadFile(getFile);
        prod_image = `${host}/${getFile.name}`;
      } else {
        prod_image =
          `${host}/noprodimage.jpg`
      }
    }

    if (!check_files) {
      prod_image =
      `${host}/noprodimage.jpg`
    }

    // Stock conditions
    if (/[^0-9]/.test(prod_stock)) {
      logger.warn(`post/products - (Stock must be an integer)`, { user: req.user.id, code: 400, method: "post", route: "/products"})
      return res.status(400).json({ Error: "Stock must be an integer" });
    }
    if (prod_stock <= 0) {
      logger.warn(`post/products - (Stock must be more than 0)`, { user: req.user.id, code: 400, method: "post", route: "/products"})
      return res.status(400).json({ Error: "Stock must be more than 0" });
    }
    if (prod_stock > 1000) {
      logger.warn(`post/products - (Stock must be less than 1000)`, { user: req.user.id, code: 400, method: "post", route: "/products"})
      return res.status(400).json({ Error: "Stock must be less than 1000" });
    }

    // Price conditions
    if (/[^0-9]/.test(prod_stock)) {
      logger.warn(`post/products - (Price must be an integer)`, { user: req.user.id, code: 400, method: "post", route: "/products"})
      return res.status(400).json({ Error: "Price must be an integer" });
    }
    if (prod_price <= 0) {
      logger.warn(`post/products - (Price must be more than 0)`, { user: req.user.id, code: 400, method: "post", route: "/products"})
      return res.status(400).json({ Error: "Price must be more than 0" });
    }
    if (prod_price > 100000) {
      logger.warn(`post/products - (Price must be less than 100000)`, { user: req.user.id, code: 400, method: "post", route: "/products"})
      return res.status(400).json({ Error: "Price must be less than 100000" });
    }

    // Name conditions
    if (/[^a-zA-Z]/.test(prod_name)) {
      logger.warn(`post/products - (Product name must be only letters)`, { user: req.user.id, code: 400, method: "post", route: "/products"})
      return res
        .status(400)
        .json({ Error: "Product name must be only letters" });
    }
    if (prod_name.length > 15) {
      logger.warn(`post/products - (Product name must be less than 15 characters)`, { user: req.user.id, code: 400, method: "post", route: "/products"})
      return res
        .status(400)
        .json({ Error: "Product name must be less than 15 characters" });
    }
    if (prod_name.length < 3) {
      logger.warn(`post/products - (Product name must be at least 3 letters)`, { user: req.user.id, code: 400, method: "post", route: "/products"})
      return res
        .status(400)
        .json({ Error: "Product name must be at least 3 letters" });
    }

    // Category conditions
    const categorys = [
      "agro",
      "fashion",
      "food",
      "home",
      "tecnology",
      "tools",
      "toys",
    ];
    if (!categorys.includes(prod_category)) {
      logger.warn(`post/products - (The category does not exist)`, { user: req.user.id, code: 400, method: "post", route: "/products"})

      return res.status(400).json({ Error: "The category does not exist" });
    }

    //Save the product
    const saveProduct = await product.create({
      prod_name,
      prod_user_id: user_id,
      prod_price,
      prod_stock,
      prod_category,
      prod_image,
    });
    logger.info(`post/products - (created product ${saveProduct.id} by user ${req.user.id})`, { product: req.params.id, user: req.user.id, code: 200, method: "post", route: "/products"})
    res.status(200).json({
      Product: prod_name,
      User: user_id,
      Price: prod_price,
      Stock: prod_stock,
      Category: prod_category,
      Image: prod_image,
    });
  } catch (error) {
    logger.error(`post/products - (creating a product by user ${req.user.id}) - Error(500): ${error}`, { user: req.user.id, code: 500, method: "post", route: "/products"})
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Update an own product
const updateProduct = async (req, res) => {
  try {
    const product_id = req.params.id;
    var getProduct = await product.findOne({ where: { id: product_id } });
    const { prod_name, prod_price, prod_stock, prod_category, prod_published } =
      req.body;
    const check_files = req.files;
    var prod_image;

    if (check_files) {
      getFile = req.files.file;
      if (getFile) {
        await uploadFile(getFile);
        prod_image = `${host}/${getFile.name}`;
      } else {
        prod_image =
          `${host}/noprodimage.jpg`
      }
    }

    if (!check_files) {
      prod_image = getProduct.prod_image;
    }

    // If empty field
    if (!prod_name) {
      getProd_name = getProduct.dataValues.prod_name;
    } else {
      // Name conditions
      if (/[^a-zA-Z]/.test(prod_name)) {
        logger.warn(`put/products/:id - (Product name must be only letters)`, { product: req.params.id, user: req.user.id, code: 400, method: "put", route: "/products/:id"})
        return res
          .status(400)
          .json({ Error: "Product name must be only letters" });
      }
      if (prod_name.length > 15) {
        logger.warn(`put/products/:id - (Product name must be less than 15 characters)`, { product: req.params.id, user: req.user.id, code: 400, method: "put", route: "/products/:id"})
        return res
          .status(400)
          .json({ Error: "Product name must be less than 15 characters" });
      }
      if (prod_name.length < 3) {
        logger.warn(`put/products/:id - (Product name must be at least 3 letters)`, { product: req.params.id, user: req.user.id, code: 400, method: "put", route: "/products/:id"})
        return res
          .status(400)
          .json({ Error: "Product name must be at least 3 letters" });
      }
      getProd_name = prod_name;
    }
    if (!prod_price) {
      getProd_price = getProduct.dataValues.prod_price;
    } else {
      // Price conditions
      if (/[^0-9]/.test(prod_price)) {
        logger.warn(`put/products/:id - (Price must be an integer)`, { product: req.params.id, user: req.user.id, code: 400, method: "put", route: "/products/:id"})

        return res.status(400).json({ Error: "Price must be an integer" });
      }
      if (prod_price <= 0) {
        logger.warn(`put/products/:id - (Price must be more than 0)`, { product: req.params.id, user: req.user.id, code: 400, method: "put", route: "/products/:id"})

        return res.status(400).json({ Error: "Price must be more than 0" });
      }
      if (prod_price > 100000) {
        logger.warn(`put/products/:id - (Price must be less than 100000)`, { product: req.params.id, user: req.user.id, code: 400, method: "put", route: "/products/:id"})

        return res
          .status(400)
          .json({ Error: "Price must be less than 100000" });
      }
      getProd_price = prod_price;
    }
    if (!prod_stock) {
      getProd_stock = getProduct.dataValues.prod_stock;
    } else {
      // Stock conditions
      if (/[^0-9]/.test(prod_stock)) {
        logger.warn(`put/products/:id - (Stock must be an integer)`, { product: req.params.id, user: req.user.id, code: 400, method: "put", route: "/products/:id"})

        return res.status(400).json({ Error: "Stock must be an integer" });
      }
      if (prod_stock <= 0) {
        logger.warn(`put/products/:id - (Stock must be more than 0)`, { product: req.params.id, user: req.user.id, code: 400, method: "put", route: "/products/:id"})

        return res.status(400).json({ Error: "Stock must be more than 0" });
      }
      if (prod_stock > 1000) {
        logger.warn(`put/products/:id - (Stock must be less than 1000)`, { product: req.params.id, user: req.user.id, code: 400, method: "put", route: "/products/:id"})
        return res.status(400).json({ Error: "Stock must be less than 1000" });
      }
      getProd_stock = prod_stock;
    }
    if (!prod_category) {
      getProd_category = getProduct.dataValues.prod_category;
    } else {
      // Category conditions
      const categorys = [
        "agro",
        "fashion",
        "food",
        "home",
        "tecnology",
        "tools",
        "toys",
      ];
      if (!categorys.includes(prod_category)) {
        logger.warn(`put/products/:id - (The category does not exist)`, { product: req.params.id, user: req.user.id, code: 400, method: "put", route: "/products/:id"})
        return res.status(400).json({ Error: "The category does not exist" });
      }

      getProd_category = prod_category;
    }
    if (!prod_published) {
      getProd_published = getProduct.dataValues.prod_published;
    } else {
      getProd_published = prod_published;
    }

    // Update
    await product.update(
      {
        prod_name: getProd_name,
        prod_price: getProd_price,
        prod_stock: getProd_stock,
        prod_category: getProd_category,
        prod_published: getProd_published,
        prod_image: prod_image,
      },
      {
        where: { id: product_id },
      }
    );
    logger.info(`put/products/:id - (updating product ${req.params.id} by user ${getProduct.prod_user_id})`, { product: req.params.id, user: req.user.id, code: 200, method: "put", route: "/products/:id"})
    // response
    res.status(200).json({
      Id: product_id,
      "Product name": getProd_name,
      "Product price": getProd_price,
      "Product stock": getProd_stock,
      "Product category": getProd_category,
      "Product published": getProd_published,
      "Product image": prod_image,
    });
  } catch (error) {
    logger.error(`put/products/:id - (updating product ${req.params.id} by user ${getProduct.prod_user_id}) - Error(500): ${error}`, { product: req.params.id, user: req.user.id, code: 500, method: "put", route: "/products/:id"})
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Delete an own product by id
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    // Product id conditions
    // if (/[^0-9]/.test(id)) {
    //     return res.status(400).json({ "Error": "Product id must be an integer" })
    // }

    // const getProduct = await product.findOne({ where: { id } })
    // if (!getProduct) {
    //     return res.status(400).json({ "Error": "Product does not exists" })
    // }
    logger.info(`delete/products/:id - (deleting product ${req.params.id})`, { product: req.params.id, user: req.user.id, code: 200, method: "delete", route: "/products/:id"})
    await product.destroy({ where: { id } });
    res.status(200).json({ Message: `Product ${id} deleted` });
  } catch (error) {
    logger.error(`delete/products/:id - (deleting product ${req.params.id}) - Error(500): ${error}`, { product: req.params.id, user: req.user.id, code: 500, method: "delete", route: "/products/:id"})
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProdByCategory,
  getProductByUserId,
  saveProduct,
  updateProduct,
  deleteProduct,
};
