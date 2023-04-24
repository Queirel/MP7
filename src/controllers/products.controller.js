/** @format */

const { uploadFileS3, getFileURLS3 } = require("../helpers/s3");
const { product } = require("../models");

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
        await uploadFileS3(getFile);
        prod_image = await getFileURLS3(getFile.name);
      } else {
        prod_image =
          "https://bucket-app-mp.s3.us-east-1.amazonaws.com/noprodimage.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXNhLWVhc3QtMSJIMEYCIQCbfGa2o%2FiKy%2F3zoaIj4Y92YGpHLDhUQjXUmA%2FV27Lu3AIhALxiwuoqojYEC8uXspV0qsNitePPRJQkinB%2BFEDM6zGwKu0CCOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMDY4MDQ4NzczNTkxIgyfuVPV8Bkx1f2BcpgqwQIL3wZImKyWvCD%2Fu34xT%2FvjwUpVCUtYiuF57ml8JZBm8oocox68ad13BUUq8iHE4srn7vSoyNVJuJqPVGLP1xvpWeMvzmW%2Fevrwv1tKi0Wjmm%2FI7xK6n%2Fw2m7ZyjeS0itjvic2THvmhowRr%2F8V1fxCCqN5dasYyAd8osY%2B9HCzBI9fb46E0Y55DF%2Ft%2F6mwHxSS6iV7L0U3y8e2N3sr%2B15gprQVUaVAdDbU9qM5aE4FwPV9y9bnWaUa32jxbmn9HJadr5%2F3gIZbI4R06pV52rIA2XM2nrSbizVzecF51VfnYbP4fhWBgjewC9NcgWN6Gz31qXCzOlRxewYtuK2nAvE3v5TZPoduUWlqW08zk63slWFsYy%2BGyrcyC91U4E%2Be5jZDtqHr5edWwM7i45sI%2BfNyxSpKq72O3fp93mxZNvct3Duow3d6XogY6sgLtj%2B0yhZGDP3XY3TPL8MLlVbcwTJ5g0AoMarFy3Z8BSe%2FsFdkeQdcA45P67FurCPL%2FupT1hldYx8Z%2F2dr5StNJohi%2BwNlRd19mQmOCqAhZyvmJGabUHvd6KbgwC1Y05BZJRhdj%2B%2FvG%2F3iV4er1G5Y%2Farces8p1boUMpbYBAQt2gVHOozVWtq6eU7Ddtm%2FHfYnerfMc10k4GXism09KztDkcpwY1sn%2BRj%2FwDPIkvbIS6ScwE76QjvDOJcmVdYZp5KvhKXel9FSvlqW7OrUqIZbhVbSS0moV8JDy%2F2yYwEvSK%2F1uGI7GeSylrcgBEG2Kb2h1Numkw5jcazmm4M0ArIn1mZs1y%2BAiSt1ti9LUMu0Y2SxBX6BHpBCqv4AqT8Z7LcOANWJQUsAvC0wKGCulIrjYZ3Y%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230424T075004Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAQ7WAF4HLYM52NBUX%2F20230424%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=9f8a1f193cfc1b4f737bc1568de15883cd42da2baabd0e05f7315359ee7e17fe";
      }
    }

    if (!check_files) {
      prod_image =
        "https://bucket-app-mp.s3.us-east-1.amazonaws.com/noprodimage.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXNhLWVhc3QtMSJIMEYCIQCbfGa2o%2FiKy%2F3zoaIj4Y92YGpHLDhUQjXUmA%2FV27Lu3AIhALxiwuoqojYEC8uXspV0qsNitePPRJQkinB%2BFEDM6zGwKu0CCOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMDY4MDQ4NzczNTkxIgyfuVPV8Bkx1f2BcpgqwQIL3wZImKyWvCD%2Fu34xT%2FvjwUpVCUtYiuF57ml8JZBm8oocox68ad13BUUq8iHE4srn7vSoyNVJuJqPVGLP1xvpWeMvzmW%2Fevrwv1tKi0Wjmm%2FI7xK6n%2Fw2m7ZyjeS0itjvic2THvmhowRr%2F8V1fxCCqN5dasYyAd8osY%2B9HCzBI9fb46E0Y55DF%2Ft%2F6mwHxSS6iV7L0U3y8e2N3sr%2B15gprQVUaVAdDbU9qM5aE4FwPV9y9bnWaUa32jxbmn9HJadr5%2F3gIZbI4R06pV52rIA2XM2nrSbizVzecF51VfnYbP4fhWBgjewC9NcgWN6Gz31qXCzOlRxewYtuK2nAvE3v5TZPoduUWlqW08zk63slWFsYy%2BGyrcyC91U4E%2Be5jZDtqHr5edWwM7i45sI%2BfNyxSpKq72O3fp93mxZNvct3Duow3d6XogY6sgLtj%2B0yhZGDP3XY3TPL8MLlVbcwTJ5g0AoMarFy3Z8BSe%2FsFdkeQdcA45P67FurCPL%2FupT1hldYx8Z%2F2dr5StNJohi%2BwNlRd19mQmOCqAhZyvmJGabUHvd6KbgwC1Y05BZJRhdj%2B%2FvG%2F3iV4er1G5Y%2Farces8p1boUMpbYBAQt2gVHOozVWtq6eU7Ddtm%2FHfYnerfMc10k4GXism09KztDkcpwY1sn%2BRj%2FwDPIkvbIS6ScwE76QjvDOJcmVdYZp5KvhKXel9FSvlqW7OrUqIZbhVbSS0moV8JDy%2F2yYwEvSK%2F1uGI7GeSylrcgBEG2Kb2h1Numkw5jcazmm4M0ArIn1mZs1y%2BAiSt1ti9LUMu0Y2SxBX6BHpBCqv4AqT8Z7LcOANWJQUsAvC0wKGCulIrjYZ3Y%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230424T075004Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAQ7WAF4HLYM52NBUX%2F20230424%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=9f8a1f193cfc1b4f737bc1568de15883cd42da2baabd0e05f7315359ee7e17fe";
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
        await uploadFileS3(getFile);
        prod_image = await getFileURLS3(getFile.name);
      } else {
        prod_image = getProduct.prod_image;
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
