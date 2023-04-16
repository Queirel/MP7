/** @format */

const { Router } = require("express");
// const striper = require("../helpers/stripe");
const { createCharges, createCostumer, addCard } = require("../controllers/stripe.controller");
const stripe = require("stripe")(process.env.STRIPE_SK);
const router = Router();

router.post("/", async (req, res) => {
  const { source, email } = req.body;
  const customer = await stripe.customers.create(
    {
      email: "asdasdasd@asd.com",
    },
    { stripeAccount: "acct_1MrHmIINvLd8tdpw" }
  );
  // customer.source = source
  return res.json(customer);
  const charge = await stripe.charges.create({
    amount: source.amount,
    currency: source.currency,
    source: source.id,
    description: "mi first sell",
    customer: customer.id,
  });

  if (charge.paid) {
    return res.status(200).send({
      status: "success",
      message: "ok",
    });
  }
  console.log(customer);
});
// router.get('/:id', getProductById)
// router.get('/user/:id', getProductByUserId)
router.post("/create-Customer", createCostumer);
router.post("/add-Card", addCard);
router.post("/create-Charges", createCharges);


module.exports = router;
