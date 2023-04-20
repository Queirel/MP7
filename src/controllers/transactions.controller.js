/** @format */

const { createCharges, addCard } = require("../helpers/stripe");
const { transaction } = require("../models");
const { product, user } = require("../models");

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
    res.status(200).json(getTransactions);
  } catch (error) {
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
      return res.status(400).json({ Error: "User id must be an integer" });
    }
    const getTransaction = await transaction.findOne({ where: { id } });
    if (!getTransaction) {
      return res.status(400).send("Transaction does not exists");
    }
    res.status(200).json(getTransaction);
  } catch (error) {
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
      return res.status(400).json({ Error: "Quantity must be an integer" });
    }
    if (/[^0-9]/.test(trans_prod_id)) {
      return res.status(400).json({ Error: "Product id must be an integer" });
    }
    if (trans_prod_quantity < 1) {
      return res.status(400).json({ Error: "Quantity must be more than 0" });
    }
    if (trans_prod_quantity >= 100) {
      return res.status(400).json({ Error: "Quantity must be less than 100" });
    }

    const user_id = req.user.id;
    const getUser = await user.findOne({ where: { id: user_id } });

    const getProduct = await product.findOne({ where: { id: trans_prod_id } });
    if (!getProduct) {
      return res.status(400).json({ Error: "Product does not exists" });
    }

    const prod_user_id = getProduct.prod_user_id;

    if (user_id == prod_user_id) {
      return res.status(400).json({ Error: "You cant buy your own product" });
    }
    if (!getProduct.dataValues.prod_published) {
      return res.status(400).json({ Error: "You cant buy a paused product" });
    }

    if (trans_prod_quantity > getProduct.dataValues.prod_stock) {
      return res.status(400).json({ Error: "Quantity exceeds stock" });
    }

    const cardId = await addCard(getUser.user_customer_id, cardName, cardExpYear, cardExpMonth, cardNumber, cardCvc)
    const amount = trans_prod_quantity*getProduct.prod_price
    const isPaid = await createCharges(amount, getUser.user_email, cardId, getUser.user_customer_id)

    if (isPaid.status == "succeeded") {
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
      res
      .status(400)
      .json({ Error: "Something wrong with the payment" });
    }

  } catch (error) {
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
      return res.status(400).json({ Error: "User id must be an integer" });
    }
    const getTransaction = await transaction.findOne({ where: { id } });
    if (!getTransaction.trans_cancel) {
      await transaction.update(
        {
          trans_cancel: true,
        },
        {
          where: { id },
        }
      );
      return res.status(200).json({ Message: `Transaction ${id} cancelled` });
    }
    res.status(200).json({ Message: `Transaction ${id} is already cancelled` });
  } catch (error) {
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
