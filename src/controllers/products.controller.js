const { uploadFile } = require("../helpers/s3");
const { product } = require("../models");
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
    res.status(200).json({ Products: getProds });
  } catch (error) {
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
      return res.status(400).json({ Error: "Id is missing" });
    }
    if (id == "") {
      return res.status(400).json({ Error: "id is empty" });
    }
    if (/[^0-9]/.test(id)) {
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
    res.status(200).json({ Product: getProduct });
  } catch (error) {
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
      return res
        .status(200)
        .json({ Message: "There is no products from that category" });
    }

    res.status(200).json({ Product: getProducts });
  } catch (error) {
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
      return res
        .status(200)
        .json({ Message: "There is no products from the user" });
    }

    res.status(200).json({ Products: getProducts });
  } catch (error) {
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
      return res
        .status(400)
        .json({ Error: "The product name field must be completed" });
    }

    if (!prod_price) {
      return res
        .status(400)
        .json({ Error: "The product price field must be completed" });
    }

    if (!prod_stock) {
      return res
        .status(400)
        .json({ Error: "The product stock field must be completed" });
    }

    if (!prod_category) {
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
      return res.status(400).json({ Error: "Stock must be an integer" });
    }
    if (prod_stock <= 0) {
      return res.status(400).json({ Error: "Stock must be more than 0" });
    }
    if (prod_stock > 1000) {
      return res.status(400).json({ Error: "Stock must be less than 1000" });
    }

    // Price conditions
    if (/[^0-9]/.test(prod_stock)) {
      return res.status(400).json({ Error: "Price must be an integer" });
    }
    if (prod_price <= 0) {
      return res.status(400).json({ Error: "Price must be more than 0" });
    }
    if (prod_price > 100000) {
      return res.status(400).json({ Error: "Price must be less than 100000" });
    }

    // Name conditions
    if (/[^a-zA-Z]/.test(prod_name)) {
      return res
        .status(400)
        .json({ Error: "Product name must be only letters" });
    }
    if (prod_name.length > 15) {
      return res
        .status(400)
        .json({ Error: "Product name must be less than 15 characters" });
    }
    if (prod_name.length < 3) {
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
    res.status(200).json({
      Product: prod_name,
      User: user_id,
      Price: prod_price,
      Stock: prod_stock,
      Category: prod_category,
      Image: prod_image,
    });
  } catch (error) {
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
    const getProduct = await product.findOne({ where: { id: product_id } });
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
        return res
          .status(400)
          .json({ Error: "Product name must be only letters" });
      }
      if (prod_name.length > 15) {
        return res
          .status(400)
          .json({ Error: "Product name must be less than 15 characters" });
      }
      if (prod_name.length < 3) {
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
      if (/[^0-9]/.test(prod_stock)) {
        return res.status(400).json({ Error: "Price must be an integer" });
      }
      if (prod_price <= 0) {
        return res.status(400).json({ Error: "Price must be more than 0" });
      }
      if (prod_price > 100000) {
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
        return res.status(400).json({ Error: "Stock must be an integer" });
      }
      if (prod_stock <= 0) {
        return res.status(400).json({ Error: "Stock must be more than 0" });
      }
      if (prod_stock > 1000) {
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

    await product.destroy({ where: { id } });
    res.status(200).json({ Message: `Product ${id} deleted` });
  } catch (error) {
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
