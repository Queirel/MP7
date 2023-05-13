const { passwordHash } = require("../helpers/bcrypt");
const { transaction } = require("../models");
const { user } = require("../models");
const { product } = require("../models");
const { geocode } = require("../helpers/geocode");
const logger = require("../helpers/logger");
const host = process.env.AWS_BUCKET_HOST


// Get user by id
const getUserByIdAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    if (/[^0-9]/.test(id)) {
      return res.status(400).json({ Error: "User id must be an integer" });
    }
    const getUser = await user.findOne({ where: { id } });
    if (!getUser) {
      return res.status(400).json({ Error: "User does not exists" });
    }
    logger.info(`get/admin/users/:id - (User ${req.user.id} got user ${req.params.id})`)
    res.status(200).json({ User: getUser });
  } catch (error) {
    logger.error(`get/admin/users/:id - (User ${req.user.id} getting user ${req.params.id}) -  Error (500): ${error.message}`)
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Get all users
const getAllUsersAdmin = async (req, res) => {
  try {
    const { offset, limit } = req.body;
    const getUsers = await user.findAll({ offset: offset, limit: limit });
    if (getUsers.length == 0) {
      return res.status(400).json({ Error: "There are no users" });
    }
    logger.info(`get/admin/users - (User ${req.user.id} got all users)`)
    res.status(200).json({ Users: getUsers });
  } catch (error) {
    logger.error(`get/admin/users - (User ${req.user.id} getting all users) - Error (500): ${error.message}`)
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Get all transactions
const getAllTransactionsAdmin = async (req, res) => {
  try {
    const { limit, offset } = req.body;
    const getTransactions = await transaction.findAll({
      offset: offset,
      limit: limit,
    });
    if (getTransactions.length == 0) {
      return res.status(400).json({ Error: "There are no transactions" });
    }
    logger.info(`Getting all transactions (Admin)`)
    res.status(200).json({ Transactions: getTransactions });
  } catch (error) {
    logger.error(`get/admin/transactions - (User ${req.user.id} getting all transactions) - Error (500): ${error.message}`)
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Save a product
const saveProductAdmin = async (req, res) => {
  try {
    const {
      prod_name,
      prod_price,
      prod_stock,
      prod_category,
      prod_published,
      prod_user_id,
    } = req.body;
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
      prod_image =
      `${host}/noprodimage.jpg`
    }

    // published conditions
    if (!typeof prod_published == "boolean") {
      return res.status(400).json({ Error: "published must be a boolean" });
    }

    // User id conditions
    if (/[^0-9]/.test(prod_user_id)) {
      return res.status(400).json({ Error: "user id must be an integer" });
    }
    const getUser = await user.findOne({ where: { id: prod_user_id } });
    if (!getUser) {
      return res.status(400).json({ Error: "User does not exists" });
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
    if (prod_name.length >= 15) {
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
      return res.status(400).json({ Error: "The category does not exists" });
    }

    const saveProduct = await product.create({
      prod_name,
      prod_user_id,
      prod_price,
      prod_stock,
      prod_category,
      prod_published,
      prod_image,
    });
    logger.info(`post/admin/products - (User ${req.user.id} created product ${saveProduct.id})`)
    res.status(200).json({ Product: saveProduct });
  } catch (error) {
    logger.error(`post/admin/products - (User ${req.user.id} creating a product) - Error (500): ${error.message}`)
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// -----------------------Update any product
const updateProductAdmin = async (req, res) => {
  try {
    const product_id = req.params.id;
    if (/[^0-9]/.test(product_id)) {
      return res.status(400).json({ Error: "Product id must be an integer" });
    }
    const getProduct = await product.findOne({ where: { id: product_id } });
    if (!getProduct) {
      return res.status(400).json({ Error: "Product does not exists" });
    }
    const {
      prod_name,
      prod_price,
      prod_user_id,
      prod_category,
      prod_published,
      // prod_stock,
    } = req.body;
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

    // published conditions
    if (!typeof prod_published == "boolean") {
      return res.status(400).json({ Error: "published must be a boolean" });
    }
    if (!prod_published) {
      getProd_published = getProduct.dataValues.prod_published;
    } else {
      getProd_published = prod_published;
    }

    // User id conditions
    const getUser = await user.findOne({ where: { id: prod_user_id } });
    if (!getUser) {
      return res.status(400).json({ Error: "User does not exists" });
    }
    if (!prod_user_id) {
      getProd_user_id = getProduct.dataValues.prod_user_id;
    } else {
      getProd_user_id = prod_user_id;
    }

    // // Stock conditions
    // if (/[^0-9]/.test(prod_stock)) {
    //     return res.status(400).json({ "Error": "Stock must be an integer" })
    // }
    // if (prod_stock <= 0) {
    //     return res.status(400).json({ "Error": "Stock must be more than 0" })
    // }
    // if (prod_stock > 1000) {
    //     return res.status(400).json({ "Error": "Stock must be less than 1000" })
    // }

    // Price conditions
    // if (/[^0-9]/.test(prod_stock)) {
    //   return res.status(400).json({ Error: "Price must be an integer" });
    // }
    if (prod_price <= 0) {
      return res.status(400).json({ Error: "Price must be more than 0" });
    }
    if (prod_price > 100000) {
      return res.status(400).json({ Error: "Price must be less than 100000" });
    }
    if (!prod_price) {
      getProd_price = getProduct.dataValues.prod_price;
    } else {
      getProd_price = prod_price;
    }

    // Name conditions
    if (/[^a-zA-Z]/.test(prod_name)) {
      return res
        .status(400)
        .json({ Error: "Product name must be only letters" });
    }
    if (prod_name.length >= 15) {
      return res
        .status(400)
        .json({ Error: "Product name must be less than 15 characters" });
    }
    if (prod_name.length < 3) {
      return res
        .status(400)
        .json({ Error: "Product name must be at least 3 letters" });
    }
    if (!prod_name) {
      getProd_name = getProduct.dataValues.prod_name;
    } else {
      getProd_name = prod_name;
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
    if (!prod_category) {
      getProd_category = getProduct.dataValues.prod_category;
    } else {
      getProd_category = prod_category;
    }

    // if (!prod_stock) {
    //     getProd_stock = getProduct.dataValues.prod_stock
    // }
    // else {
    //     getProd_stock = prod_stock
    // }

    await product.update(
      {
        prod_name: getProd_name,
        prod_price: getProd_price,
        prod_category: getProd_category,
        prod_user_id: getProd_user_id,
        prod_published: getProd_published,
        prod_stock: getProduct.dataValues.prod_stock,
        prod_image: prod_image,
      },
      {
        where: { id: product_id },
      }
    );
    logger.info(`put/admin/products/:id - (User ${req.user.id} updated product ${req.params.id})`)
    res.status(200).json({
      Id: product_id,
      "Product name": getProd_name,
      "Product price": getProd_price,
      "Product stock": getProduct.dataValues.prod_stock,
      "User owner": getProd_user_id,
      "Product category": getProd_category,
      "Product published": getProd_published,
      "Product image": prod_image,
    });
  } catch (error) {
    logger.error(`put/admin/products/:id - (User ${req.user.id} update product ${req.params.id}) - Error (500): ${error.message}`)
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Delete a transaction by id
const deleteTransactionAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    if (/[^0-9]/.test(id)) {
      return res
        .status(400)
        .json({ Error: "Transaction id must be an integer" });
    }
    const getTransaction = await transaction.destroy({ where: { id } });
    if (!getTransaction) {
      return res.status(400).json("Transaction does not exists");
    }
    logger.info(`delete/admin/transactions/:id - (User ${req.user.id} deleted transaction ${req.params.id})`)
    res.status(200).json(`Transaction ${id} deleted`);
  } catch (error) {
    logger.error(`delete/admin/transactions/:id - (User ${req.user.id} deleting transaction ${req.params.id}) -Error (500): ${error.message}`)
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Update user by id
const updateUserByIdAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    if (/[^0-9]/.test(id)) {
      return res.status(400).json({ Error: "User id must be an integer" });
    }
    const getUser = await user.findOne({ where: { id } });
    if (!getUser) {
      return res.status(400).json({ Error: "User does not exists" });
    }
    const {
      user_name,
      user_password,
      user_realname,
      user_lastname,
      user_dni,
      user_role,
      user_email,
      user_street_number,
      user_route,
      user_locality,
    } = req.body;

    // Username conditions
    if (!user_name) {
      getUser_name = getUser.dataValues.user_name;
    } else {
      if (/[^a-zA-Z0-9]/.test(user_name)) {
        return res
          .status(400)
          .json({ Error: "The username must be only letters and numbers" });
      }
      if (user_name.length >= 15) {
        return res
          .status(400)
          .json({ Error: "The username must be less than 15 characters" });
      }
      if (user_name.length < 3) {
        return res
          .status(400)
          .json({ Error: "The username must be at least 3 characters" });
      }
      getUser_name = user_name;
    }

    if (!user_realname) {
      getUser_realname = getUser.dataValues.user_realname;
    } else {
      if (/[^a-zA-Z]/.test(user_realname)) {
        return res.status(400).json({ Error: "The name must be only letters" });
      }
      if (user_realname.length >= 15) {
        return res
          .status(400)
          .json({ Error: "The name must be less than 15 characters" });
      }
      if (user_realname.length < 3) {
        return res
          .status(400)
          .json({ Error: "The name must be at least 3 letters" });
      }
      getUser_realname = user_realname;
    }
    if (!user_lastname) {
      getUser_lastname = getUser.dataValues.user_lastname;
    } else {
      if (/[^a-zA-Z]/.test(user_lastname)) {
        return res
          .status(400)
          .json({ Error: "The lastname must be only letters" });
      }
      if (user_lastname.length >= 15) {
        return res
          .status(400)
          .json({ Error: "The lastname must be less than 15 characters" });
      }
      if (user_lastname.length < 2) {
        return res
          .status(400)
          .json({ Error: "The lastname must be at least 2 letters" });
      }
      getUser_lastname = user_lastname;
    }

    if (!user_dni) {
      getUser_dni = getUser.dataValues.user_dni;
    } else {
      if (/[^0-9]/.test(user_dni)) {
        return res.status(400).json({ Error: "DNI must be an integer" });
      }
      const dniLenght = user_dni.toString().length;
      if (dniLenght < 8) {
        return res
          .status(400)
          .json({ Error: "DNI must be at least 8 numbers" });
      }
      if (dniLenght > 10) {
        return res
          .status(400)
          .json({ Error: "DNI must be at most 10 numbers" });
      }
      getUser_dni = user_dni;
    }
    if (!user_email) {
      getUser_email = getUser.dataValues.user_email;
    } else {
      getUser_email = user_email;
    }
    // Password conditions
    if (user_password.length > 30) {
      return res
        .status(400)
        .json({ Error: "Password must be at most 30 characters" });
    }
    if (user_password.length < 4) {
      return res
        .status(400)
        .json({ Error: "Password must be at least 4 characters" });
    }
    if (!user_password) {
      getUser_password = getUser.dataValues.user_password;
    }
    getUser_password = user_password;

    const passHash = await passwordHash(getUser_password);

    // Role conditions
    const roles = ["user", "admin"];
    if (!user_role) {
      getUser_role = getUser.dataValues.user_role;
    } else {
      if (!roles.includes(user_role)) {
        return res.status(400).json({ Error: "The role does not exist" });
      }
      getUser_role = user_role;
    }
    if (!user_street_number && !user_route && !user_locality) {
      getUser_address = getUser.dataValues.user_address;
      address = getUser.dataValues.user_address
    } else {
      // Address conditions
      if (user_street_number) {
        if (user_street_number.length > 30) {
          return res
            .status(400)
            .json({ Error: "The street number must be at most 10 characters" });
        }
      }
      if (user_route) {
        if (user_route.length > 30) {
          return res
            .status(400)
            .json({ Error: "Route must be at most 30 characters" });
        }
      }
      if (user_locality) {
        if (user_locality.length > 30) {
          return res
            .status(400)
            .json({ Error: "Locality must be at most 30 characters" });
        }
      }
      const user_address = `${user_street_number},${user_route},${user_locality}`;
      address = await geocode(user_address);
      if (address == "Error") {
        return res
          .status(400)
          .json({ Error: "Some address field is incorrect" });
      }
      getUser_address = address.Place;
    
    }

    await user.update(
      {
        user_name: getUser_name,
        user_realname: getUser_realname,
        user_lastname: getUser_lastname,
        user_dni: getUser_dni,
        user_email: getUser_email,
        user_password: passHash,
        user_role: getUser_role,
        user_address: getUser_address,
      },
      { where: { id } }
    );
    logger.info(`put/admin/users/:id - (User ${req.user.id} updated user ${req.params.id})`)
    res.status(200).json({
      id,
      "User name": getUser_name,
      Name: getUser_realname,
      Lastname: getUser_lastname,
      DNI: getUser_dni,
      Role: getUser_role,
      Password: passHash,
      email: getUser_email,
      Address: address,
    });
  } catch (error) {
    logger.error(`put/admin/users/:id - (User ${req.user.id} updating user ${req.params.id}) - Error (500): ${error.message}`)
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

const updateTransactionAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    if (/[^0-9]/.test(id)) {
      return res
        .status(400)
        .json({ Error: "Transaction id must be an integer" });
    }
    const { trans_cancel } = req.body;
    const getTransaction = await transaction.findOne({ where: { id } });
    if (!getTransaction) {
      return res.status(400).json({ Error: "Transaction does not exists" });
    }
    if (!trans_cancel) {
      getTrans_cancel = getTransaction.trans_cancel;
    } else {
      getTrans_cancel = trans_cancel;
    }
    await transaction.update(
      {
        trans_cancel: getTrans_cancel,
      },
      {
        where: { id },
      }
    );
    logger.info(`put/admin/transactions/:id - (User ${req.user.id} updated transaction ${req.params.id})`)
    res.status(200).json({ getTransaction });
  } catch (error) {
    logger.error(`put/admin/transactions/:id - (User ${req.user.id} updating transaction ${req.params.id}) - Error (500): ${error.message}`)
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Delete user by id:
const deleteUserByIdAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    if (/[^0-9]/.test(id)) {
      return res.status(400).json({ Error: "user id must be an integer" });
    }
    const getUser = await user.findOne({ where: { id } });
    if (!getUser) {
      return res.status(400).json({ Error: "User does not exists" });
    }
    if (req.user.user_role == "admin") {
      return res
        .status(400)
        .json({ Error: "You can't delete an admin account" });
    }
    const getProduct = await product.findOne({ where: { prod_user_id: id } });
    if (getProduct) {
      return res
        .status(400)
        .json({ Error: "User owns products, cannot be removed" });
    }
    await user.destroy({ where: { id } });
    logger.info(`delete/admin/users/:id - (User ${req.user.id} deleted user ${req.params.id})`)
    res.status(200).json({ Message: `User ${id} deleted` });
  } catch (error) {
    logger.error(`delete/admin/users/:id - (User ${req.user.id} deleting user ${req.params.id}) - Error (500): ${error.message}`)
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

module.exports = {
  getAllUsersAdmin,
  getUserByIdAdmin,
  getAllTransactionsAdmin,
  // saveTransactionAdminStockControl,
  saveProductAdmin,
  updateProductAdmin,
  updateUserByIdAdmin,
  updateTransactionAdmin,
  deleteTransactionAdmin,
  deleteUserByIdAdmin,
};



// // Create Transaction for any user
// const saveTransactionAdminStockControl = async (req, res) => {
//   try {
//     const {
//       trans_prod_id,
//       trans_prod_quantity,
//       trans_cancel,
//       trans_buy_user_id,
//     } = req.body;

//     if (/[^0-9]/.test(trans_prod_quantity)) {
//       return res.status(400).json({ Error: "Quantity must be an integer" });
//     }
//     if (trans_prod_quantity < 1) {
//       return res.status(400).json({ Error: "Quantity must be more than 0" });
//     }
//     if (trans_prod_quantity >= 100) {
//       return res.status(400).json({ Error: "Quantity must be less than 100" });
//     }
//     if (trans_prod_quantity > getProduct.dataValues.prod_stock) {
//       return res.status(400).json({ Error: "Quantity exceeds stock" });
//     }
//     if (/[^0-9]/.test(trans_prod_id)) {
//       return res.status(400).json({ Error: "Product id must be an integer" });
//     }
//     const getUser = await user.findOne({ where: { id: trans_buy_user_id } });
//     if (!getUser) {
//       return res.status(400).json({ Error: "User does not exists" });
//     }
//     const getProduct = await product.findOne({ where: { id: trans_prod_id } });
//     if (!getProduct) {
//       return res.status(400).json({ Error: "Product does not exists" });
//     }
//     if (/[^0-9]/.test(trans_buy_user_id)) {
//       return res.status(400).json({ Error: "User id must be an integer" });
//     }
//     const prod_user_id = getProduct.prod_user_id;
//     if (trans_buy_user_id == prod_user_id) {
//       return res.status(400).json({ Error: "Seller cant buy his own product" });
//     }
//     if (!getProduct.dataValues.prod_published) {
//       return res.status(400).json({ Error: "You cant buy a paused product" });
//     }
//     if (!typeof trans_cancel == "boolean") {
//       return res
//         .status(400)
//         .json({ Error: "transaction cancel must be a boolean" });
//     }
//     if (trans_prod_quantity == getProduct.dataValues.prod_stock) {
//       const NewStock = getProduct.dataValues.prod_stock - trans_prod_quantity;
//       const getTransaction = await transaction.create({
//         trans_cancel,
//         trans_prod_id,
//         trans_prod_quantity,
//         trans_buy_user_id,
//       });
//       await product.update(
//         {
//           prod_published: false,
//           prod_stock: NewStock,
//         },
//         { where: { id: trans_prod_id } }
//       );
//       return res.status(200).json({
//         Message: "Out of stock, product paused",
//         Transaction: getTransaction,
//       });
//     }
//     const NewStock = getProduct.dataValues.prod_stock - trans_prod_quantity;
//     console.log(NewStock);
//     const getTransaction = await transaction.create({
//       trans_cancel,
//       trans_prod_id,
//       trans_prod_quantity,
//       trans_buy_user_id,
//     });
//     await product.update(
//       {
//         prod_stock: NewStock,
//       },
//       { where: { id: trans_prod_id } }
//     );
//     res.status(200).json({
//       "Remaining product quantity": NewStock,
//       Transaction: getTransaction,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ Error: "An unexpected error occurred. please try again later" });
//     console.log(error.message);
//   }
// };
