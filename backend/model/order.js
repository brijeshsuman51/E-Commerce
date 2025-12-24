const mongoose = require('mongoose')
const {Schema} = mongoose;

const orderSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    products:[{
        productId:{
            type:Schema.Types.ObjectId,
            ref:'product',
            required:true
        },
        quantity:{
            type:Number,
            required:true,
            min:1
        },
        price:{
            type:Number,
            required:true,
            min:0
        }
    }],
    totalAmount:{
        type:Number,
        required:true,
        min:0
    },
    status:{
        type:String,
        enum:['pending','processing','shipped','delivered','cancelled'],
        default:'pending'
    },
    shippingAddress:{
        street:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        zipCode:{
            type:String,
            required:true
        },
        country:{
            type:String,
            default:'INDIA'
        }
    },
    paymentMethod:{
        type:String,
        enum:['credit_card','debit_card','paypal','cash_on_delivery'],
        default:'credit_card'
    },
    paymentStatus:{
        type:String,
        enum:['pending','paid','failed'],
        default:'pending'
    }
},{timestamps:true})

orderSchema.index({userId:1})

const Order = mongoose.model('order',orderSchema)

module.exports = Order;