const mongoose = require('mongoose');
const {Schema} = mongoose;

const freshSaleSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    discount: {
        type: Number,
        required: true,
        min: 1,
        max: 99
    },
    startTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    endTime: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true });


freshSaleSchema.index({ endTime: 1, isActive: 1 });
const FreshSale = mongoose.model('freshsale', freshSaleSchema);

module.exports = FreshSale;