const mongoose = require('mongoose')
const {Schema} = mongoose;

const mediaSchema = new Schema({
    problemId:{
        type:Schema.Types.ObjectId,
        ref:"problem",
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    cloudinaryPublicId:{
        type:String,
        required:true,
        unique:true
    },
    secureUrl:{
        type:String,
        required:true

    },
    thumbnailUrl:{
        type:String
    },
    duration:{
        type:Number,
        required:true
    }
},{timestamps:true})


const Media = mongoose.model('media',mediaSchema)

module.exports = Media;