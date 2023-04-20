/** @format */

const stripe = require("stripe")(process.env.STRIPE_SK);

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

// function createStripeConnection(stripe_api_key){
//     const Stripe = require("stripe");
//     const stripe = Stripe(stripe_api_key);
//     stripe.setApiVersion('2022-11-15');//lock API version down to avoid code breaking
//     // stripe.setAppInfo({
//     //     name: 'Servicebot',
//     //     version: "1.1.3", //Optional
//     //     url: 'https://servicebot.io' // Optional
//     // });
//     stripe.setMaxNetworkRetries(3); //retry on network failure
//     return stripe;
// }

// const stripe = createStripeConnection(process.env.STRIPE_SK);
// console.log(await stripe.invoices.list());

// // const stripe = require('stripe')(process.env.STRIPE_SK)

// //create new customer

// var createCustomer = function () {
//     var param ={};
//     param.email ="mike@gmail.com";
//     param.name="Mike";
//     param.description ="from node";

//     stripe.customers.create(param, function (err,customer) {
//         if(err)
//         {
//             console.log("err: "+err);
//         }if(customer)
//         {
//             console.log("success: "+customer)
//         }else{
//             console.log("Something wrong")
//         }
//     })

// }

// //createCustomer();

// var retrieveCustomer = function () {

//     stripe.customers.retrieve("cus_Gi1jjdxYhsaMN2", function (err,customer) {
//         if(err)
//         {
//             console.log("err: "+err);
//         }if(customer)
//         {
//             console.log("success: "+JSON.stringify(customer, null, 2));
//         }else{
//             console.log("Something wrong")
//         }
//     })
// }
// //retrieveCustomer();

// var createToken = function () {

//     var param = {};
//     param.card ={
//         number: '4242424242424242',
//         exp_month: 2,
//         exp_year:2024,
//         cvc:'212'
//     }

//     stripe.tokens.create(param, function (err,token) {
//         if(err)
//         {
//             console.log("err: "+err);
//         }if(token)
//         {
//             console.log("success: "+JSON.stringify(token, null, 2));
//         }else{
//             console.log("Something wrong")
//         }
//     })
// }
// //createToken();

// var addCardToCustomer = function () {

//     stripe.customers.createSource('cus_Gi1jjdxYhsaMN2',{source: 'tok_1GAcj5CEXnEqdvqzXq4VFPGJ'}, function (err,card) {
//         if(err)
//         {
//             console.log("err: "+err);
//         }if(card)
//         {
//             console.log("success: "+JSON.stringify(card, null, 2));
//         }else{
//             console.log("Something wrong")
//         }
//     })
// }

// //addCardToCustomer();

// var chargeCustomerThroughCustomerID = function () {

//     var param = {
//         amount: '2000',
//         currency: 'usd',
//         description:'First payment',
//         customer:'cus_Gi1jjdxYhsaMN2'
//     }

//     stripe.charges.create(param, function (err,charge) {
//         if(err)
//         {
//             console.log("err: "+err);
//         }if(charge)
//         {
//             console.log("success: "+JSON.stringify(charge, null, 2));
//         }else{
//             console.log("Something wrong")
//         }
//     })
// }
// //chargeCustomerThroughCustomerID();

// var chargeCustomerThroughTokenID = function () {

//     var param = {
//         amount: '2000',
//         currency: 'usd',
//         description:'First payment',
//         source:'tok_1GFGKuCEXnEqdvqz10yhHl8s'
//     }

//     stripe.charges.create(param, function (err,charge) {
//         if(err)
//         {
//             console.log("err: "+err);
//         }if(charge)
//         {
//             console.log("success: "+JSON.stringify(charge, null, 2));
//         }else{
//             console.log("Something wrong")
//         }
//     })
// }

// //chargeCustomerThroughTokenID();

// var getAllCustomers = function () {

//     stripe.customers.list({limit: 4},function (err,customers) {
//         if(err)
//         {
//             console.log("err: "+err);
//         }if(customers)
//         {
//             console.log("success: "+JSON.stringify(customers.data, null, 2));
//         }else{
//             console.log("Something wrong")
//         }
//     })
// }

// getAllCustomers();

// const srtipeProduct = async(product_id, quantity, price, ) =>{

// }

// // Checkout
// const srtipeCheckout = async(product_id, quantity, price, ) =>{
//     // products id:
//     const productId="price_1Mrwk0INvLd8tdpw5WlAsdg2"

//     //  Checkout URL - buyer ll pay:
//     const session = await stripe.checkout.sessions.create({
//         //products list:
//         line_items: [
//             //product x:
//             {
//                 price,
//                 quantity,

//             }
//             //product x+1
//         ],

//         payment_method_types:[
//             "card",
//         ],
//         mode:"payment",
//         success_url:"http://localhost:3000/success",
//         //payment:
//         //success
//         //4242 4242 4242 4242
//         //requires authentication
//         //4000 0025 0000 3155
//         //decined
//         //4000 0000 0000 9995
//         cancel_url:"http://localhost:3000/fail"

//     })

// return session

// }

// module.exports = {
//     srtipeCheckout,
//     srtipeProduct
// }
