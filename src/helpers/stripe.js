const stripe = require('stripe')(process.env.STRIPE_SK)

const striper = async(req, res) =>{
    // products id:
    const productId="price_1Mrwk0INvLd8tdpw5WlAsdg2"

    //  Checkout URL - buyer ll pay:
    const session = await stripe.checkout.sessions.create({
        //products list:
        line_items: [
            //product x:
            {
                price: productId,
                quantity: 1
            }
            //product x+1
        ],

        payment_method_types:[
            "card",
        ],
        mode:"payment",
        success_url:"http://localhost:3000/success",
        //payment:
        //success
        //4242 4242 4242 4242
        //requires authentication
        //4000 0025 0000 3155
        //decined
        //4000 0000 0000 9995
        cancel_url:"http://localhost:3000/fail"

    }) 

res.json({
    stripe_info: session
})

}

module.exports=striper