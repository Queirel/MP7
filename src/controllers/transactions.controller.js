const { createCharges, addCard } = require("../helpers/stripe");
const { transaction } = require("../models");
const { product, user } = require("../models");
const logger = require("../helpers/logger");

// Get own transactions
const getOwnTransactions = async (req, res) => {
  try {
    const trans_buy_user_id = req.user.id;
    const { limit, offset } = req.body;
    const getTransactions = await transaction.findAll({
      where: { trans_buy_user_id },
      offset: offset,
      limit: limit,
    });
    logger.info(`get/transactions - (user ${req.user.id} getted his transactions)`,{ user: getTransaction.trans_buy_user_id, code: 200, method: "get", route: "/transactions"})
    res.status(200).json(getTransactions);
  } catch (error) {
    logger.error(`get/transactions - (user ${req.user.id} getting his transactions) - Error(500): ${error}`,{ user: getTransaction.trans_buy_user_id, code: 500, method: "get", route: "/transactions"})
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Get own transaction by id
const getTransactionById = async (req, res) => {
  try {
    const id = req.params.id;

    // Transaction id conditions
    if (/[^0-9]/.test(id)) {
      logger.warn(`get/transactions/:id - (User id must be an integer)`,{ transaction: req.params.id, user: getTransaction.trans_buy_user_id, code: 400, method: "get", route: "/transactions/:id"})
      return res.status(400).json({ Error: "User id must be an integer" });
    }
    var getTransaction = await transaction.findOne({ where: { id } });
    if (!getTransaction) {
      logger.warn(`get/transactions/:id - (Transaction does not exists)`,{ transaction: req.params.id, user: getTransaction.trans_buy_user_id, code: 400, method: "get", route: "/transactions/:id"})
      return res.status(400).send("Transaction does not exists");
    }
    logger.info(`get/transactions/:id - (user ${getTransaction.trans_buy_user_id} getted his transaction ${req.params.id})`,{ transaction: req.params.id, user: getTransaction.trans_buy_user_id, code: 200, method: "get", route: "/transactions/:id"})
    res.status(200).json(getTransaction);
  } catch (error) {
    logger.error(`get/transactions/:id - (user ${getTransaction.trans_buy_user_id} getting his transaction ${req.params.id}) - Error(500): ${error}`,{ transaction: req.params.id, user: getTransaction.trans_buy_user_id, code: 500, method: "get", route: "/transactions/:id"})
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Create a transaction and control the stock
const createTransactionAndStockControl = async (req, res) => {
  try {

    const { 
        //transacton req
        trans_prod_id, trans_prod_quantity,
        //card req
        cardName, cardExpYear, cardExpMonth, cardNumber, cardCvc
 } = req.body;

    if (/[^0-9]/.test(trans_prod_quantity)) {
      logger.warn(`post/transactions - (Quanity must be an intteger)`,{ user: req.user.id, code: 400, method: "post", route: "/transactions"})
      return res.status(400).json({ Error: "Quanity must be an intteger" });
    }
    if (/[^0-9]/.test(trans_prod_id)) {
      logger.warn(`post/transactions - (Product id must be an integer)`,{ user: req.user.id, code: 400, method: "post", route: "/transactions"})
      return res.status(400).json({ Error: "Product id must be an integer" });
    }
    if (trans_prod_quantity < 1) {
      logger.warn(`post/transactions - (Quantity must be more than 0)`,{ user: req.user.id, code: 400, method: "post", route: "/transactions"})
      return res.status(400).json({ Error: "Quantity must be more than 0" });
    }
    if (trans_prod_quantity >= 100) {
      logger.warn(`post/transactions - (Quantity must be less than 100)`,{ user: req.user.id, code: 400, method: "post", route: "/transactions"})
      return res.status(400).json({ Error: "Quantity must be less than 100" });
    }

    const user_id = req.user.id;
    const getUser = await user.findOne({ where: { id: user_id } });

    const getProduct = await product.findOne({ where: { id: trans_prod_id } });
    if (!getProduct) {
      logger.warn(`post/transactions - (Product does not exists)`,{ user: req.user.id, code: 400, method: "post", route: "/transactions"})
      return res.status(400).json({ Error: "Product does not exists" });
    }

    const prod_user_id = getProduct.prod_user_id;

    if (user_id == prod_user_id) {
      logger.warn(`post/transactions - (You cant buy your own product)`,{ user: req.user.id, code: 400, method: "post", route: "/transactions"})
      return res.status(400).json({ Error: "You cant buy your own product" });
    }
    if (!getProduct.dataValues.prod_published) {
      logger.warn(`post/transactions - (You cant buy a paused product)`,{ user: req.user.id, code: 400, method: "post", route: "/transactions"})
      return res.status(400).json({ Error: "You cant buy a paused product" });
    }

    if (trans_prod_quantity > getProduct.dataValues.prod_stock) {
      logger.warn(`post/transactions - (Quantity exceeds stock)`,{ user: req.user.id, code: 400, method: "post", route: "/transactions"})
      return res.status(400).json({ Error: "Quantity exceeds stock" });
    }

    const cardId = await addCard(getUser.user_customer_id, cardName, cardExpYear, cardExpMonth, cardNumber, cardCvc)
    const amount = trans_prod_quantity*getProduct.prod_price
    const isPaid = await createCharges(amount, getUser.user_email, cardId, getUser.user_customer_id)

    if (isPaid.status == "succeeded") {p
      if (trans_prod_quantity == getProduct.dataValues.prod_stock) {
        const NewStock = getProduct.dataValues.prod_stock - trans_prod_quantity;
        const getTransaction = await transaction.create({
          trans_prod_id,
          trans_prod_quantity,
          trans_buy_user_id: user_id,
        });
        await product.update(
          {
            prod_published: false,
            prod_stock: NewStock,
          },
          { where: { id: trans_prod_id } }
        );
        logger.info(`post/transactions - (user ${req.user.id} created transaction ${getTransaction.id})`,{ transaction: getTransaction.id, user: req.user.id, code: 200, method: "post", route: "/transactions"})
        return res.status(200).json({
          Message: "Out of stock, product paused",
          "Transaction id": getTransaction.id,
          User: user_id,
          Product: trans_prod_id,
          Quantity: trans_prod_quantity,
          Receip: isPaid.receipt_url
        });
      }
      const NewStock = getProduct.dataValues.prod_stock - trans_prod_quantity;
      const getTransaction = await transaction.create({
        trans_prod_id,
        trans_prod_quantity,
        trans_buy_user_id: user_id,
      });
      await product.update(
        {
          prod_stock: NewStock,
        },
        { where: { id: trans_prod_id } }
      );
      logger.info(`post/transactions - (user ${req.user.id} created transaction ${getTransaction.id})`,{ transaction: getTransaction.id, user: req.user.id, code: 200, method: "post", route: "/transactions"})
      res.status(200).json({
        "Remaining product quantity": NewStock,
        "Transaction id": getTransaction.id,
        User: user_id,
        Product: trans_prod_id,
        Quantity: trans_prod_quantity,
        Receip: isPaid.receipt_url
      });
    }
    else {
      logger.warn(`post/transactions - (Something wrong with the payment)`,{ user: req.user.id, code: 400, method: "post", route: "/transactions"})
      res
      .status(400)
      .json({ Error: "Something wrong with the payment" });
    }

  } catch (error) {
    logger.error(`post/transactions - (user ${req.user.id} creating a transaction) - Error(500): ${error}`, { user: req.user.id, code: 500, method: "post", route: "/transactions"})
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

// Cancel own transaction by id
const cancelTransactionById = async (req, res) => {
  try {
    const id = req.params.id;
    if (/[^0-9]/.test(id)) {
      logger.warn(`put/transactions/:id - (User id must be an integer)`, { transaction: req.params.id, user: getTransaction.trans_buy_user_id, code: 400, method: "put", route: "/transactions/:id"})
      return res.status(400).json({ Error: "User id must be an integer" });
    }
    var getTransaction = await transaction.findOne({ where: { id } });
    if (!getTransaction.trans_cancel) {
      await transaction.update(
        {
          trans_cancel: true,
        },
        {
          where: { id },
        }
      );
      logger.info(`put/transactions/:id - (user ${getTransaction.trans_buy_user_id} cancelled transaction ${req.params.id})`, { transaction: req.params.id, user: getTransaction.trans_buy_user_id, code: 200, method: "put", route: "/transactions/:id"})
      return res.status(200).json({ Message: `Transaction ${id} cancelled` });
    }
    logger.info(`put/transactions/:id - (Transaction ${id} is already cancelled)`, { transaction: req.params.id, user: getTransaction.trans_buy_user_id, code: 200, method: "put", route: "/transactions/:id"})
    res.status(200).json({ Message: `Transaction ${id} is already cancelled` });
  } catch (error) {
    logger.error(`put/transactions/:id - (user ${getTransaction.trans_buy_user_id} canceling transaction ${req.params.id}) - Error(500): ${error}`, { transaction: req.params.id, user: getTransaction.trans_buy_user_id, code: 500, method: "put", route: "/transactions/:id"})
    res
      .status(500)
      .json({ Error: "An unexpected error occurred. please try again later" });
    console.log(error.message);
  }
};

module.exports = {
  getTransactionById,
  getOwnTransactions,
  createTransactionAndStockControl,
  cancelTransactionById,
};
