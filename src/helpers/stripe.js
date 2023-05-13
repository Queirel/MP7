require('dotenv').config()
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SK)

const createCustomer = async (name, email) => {
  const customer = await stripe.customers.create({
    name,
    email,
  });
  return customer;
};

const addCard = async ( customer_Id, card_Name, card_ExpYear, card_ExpMonth, card_Number, card_CVC) => {
  const card_Token = await stripe.tokens.create({
    card: {
      name: card_Name,
      number: card_Number,
      exp_month: card_ExpMonth,
      exp_year: card_ExpYear,
      cvc: card_CVC,
    },
  });
  const card = await stripe.customers.createSource(customer_Id, {
    source: card_Token.id,
  });
  return card.id
};

const createCharges = async (amount, email, card_Id, customer_Id) => {
  const createCharge = await stripe.charges.create({
    receipt_email: email,
    amount: amount * 100,
    currency: "USD",
    card: card_Id,
    customer: customer_Id,
  });
  return createCharge
};

module.exports = {
  createCustomer,
  addCard,
  createCharges,
};