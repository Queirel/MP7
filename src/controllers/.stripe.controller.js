const stripe = require("stripe")(process.env.STRIPE_SK);

const createCostumer = async (req, res) => {
    const { email, name } = req.body;
    const customer = await stripe.customers.create({
      name,
      email,
    });
    res.status(200).send(customer);
  };
  
  const addCard = async (req, res) => {
    const {
      customer_Id,
      card_Name,
      card_ExpYear,
      card_ExpMonth,
      card_Number,
      card_CVC,
    } = req.body;
  
    const card_Token = await stripe.tokens.create({
      card:{name: card_Name,
      number: card_Number,
      exp_month: card_ExpMonth,
      exp_year: card_ExpYear,
      cvc: card_CVC}
    });
  
    const card = await stripe.customers.createSource(customer_Id,{
      source: card_Token.id
    })
    res.status(200).json({card: card.id});
  };
  
  const createCharges = async (req, res) => {
    const { currency, amount, email, card_Id, customer_Id } = req.body;
    const createCharge = await stripe.charges.create({
      receipt_email: email,
      amount: amount*100,
      currency,
      card: card_Id,
      customer: customer_Id
    });
    res.status(200).send(createCharge);
  };
  
  module.exports = {
    createCostumer,
    addCard,
    createCharges
  }