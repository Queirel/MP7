const {product} = require("../models");
const {transaction} = require("../models");

// Is a superadmin
const isSuperadmin = (req,res,next) =>{
    const user_role = req.user.user_role
    if(user_role == 'superadmin'){
        next()
    }
    else{
        res.json({forbidden: 'you does not have access'})
    }
}

// Its you
const isUser = (req,res,next) =>{
    const id = req.params.id
    const user_id  = req.user.id
    if( id == user_id ){
        next()
    }
    else{
        res.json({forbidden: 'you does not have access'})
    }
}

// Its your product
const isUserProduct = async (req,res,next) =>{
    const product_id = req.params.id
    const user_id  = req.user.id
    const getProduct = await product.findOne({where:{id:product_id}})
    const prod_user_id = getProduct.prod_user_id
    if(user_id == prod_user_id){
        next()
    }
    else{
        res.json({forbidden: 'you does not have access'})
    }
}

// Its your transaction
const isUserTransaction = async (req,res,next) =>{
    const transaction_id = req.params.id
    const user_id  = req.user.id
    const getTransaction = await product.findOne({where:{id:transaction_id}})
    const trans_user_id = getTransaction.trans_user_id
    if(user_id == trans_user_id){
        next()
    }
    else{
        res.json({forbidden: 'you does not have access'})
    }
}

module.exports={
    isSuperadmin,
    isUser,
    isUserProduct,
    isUserTransaction
}