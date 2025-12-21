const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    category:{
        type:String,
        required:true,
        enum:['electronics','clothing','books','home','sports','beauty','toys','automotive']
    },
    images:{
        type:[String],
        default:[]
    },
    stock:{
        type:Number,
        required:true,
        min:0,
        default:0
    },
    brand:{
        type:String,
        trim:true
    },
    rating:{
        type:Number,
        min:0,
        max:5,
        default:0
    },
    numReviews:{
        type:Number,
        default:0
    },
    isActive:{
        type:Boolean,
        default:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
},{timestamps:true})

const Product = mongoose.model('product',productSchema)

module.exports = Product