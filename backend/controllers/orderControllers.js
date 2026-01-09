const Order = require('../model/order')
const User = require('../model/user')
const Product = require('../model/product')
const FreshSale = require('../model/freshSale')

// Create Order

const createOrder = async (req,res) => {
    try {
        const userId = req.result._id;
        const { products, shippingAddress, paymentMethod } = req.body;

        if(!products || !Array.isArray(products) || products.length === 0 || !shippingAddress){
            return res.status(400).send('Products and shipping address are required')
        }
        const user = await User.findById(userId);
        if (!user.phone || !user.phone.trim()) {
            return res.status(400).send('Phone number is required. Please update your profile.')
        }
        if (!user.address || !user.address.street || !user.address.city || !user.address.state || !user.address.zipCode) {
            return res.status(400).send('Complete address information is required. Please update your profile.')
        }

        let totalAmount = 0;
        let totalSavings = 0;
        const orderProducts = [];

        for(const item of products){
            const product = await Product.findById(item.productId);
            if(!product || !product.isActive || product.stock < item.quantity){
                return res.status(400).send(`Product ${item.productId} not available or insufficient stock`)
            }

            const activeSale = await FreshSale.findOne({
                productId: item.productId,
                isActive: true,
                endTime: { $gt: new Date() }
            });

            let price = product.price;
            let originalPrice = product.price;
            let discountApplied = 0;

            if (activeSale) {
                discountApplied = activeSale.discount;
                price = product.price * (1 - activeSale.discount / 100);
            }

            totalAmount += price * item.quantity;
            totalSavings += (originalPrice - price) * item.quantity;

            orderProducts.push({
                productId: item.productId,
                quantity: item.quantity,
                price: price,
                originalPrice: originalPrice,
                discountApplied: discountApplied,
                name: product.name
            })

            product.stock -= item.quantity;
            await product.save();
        }

        const order = await Order.create({
            userId,
            products: orderProducts,
            totalAmount,
            totalSavings,
            shippingAddress,
            paymentMethod: paymentMethod || 'credit_card'
        })

        await User.findByIdAndUpdate(userId, {$push: {orders: order._id}})

        await User.findByIdAndUpdate(userId, {cart: []})

        res.status(201).json({ message: "Order Created Successfully", order });

    } catch (error) {
        res.status(400).send("Error:"+error.message)
    }
}

// Get User Orders

const getUserOrders = async (req,res) => {
    try {
        const userId = req.result._id;
        const orders = await Order.find({userId}).populate('products.productId', 'name price images').sort({createdAt: -1})
        res.status(200).json(orders)
    } catch (error) {
        res.status(400).send("Error:"+error.message)
    }
}


// Get All Orders (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'firstName email').populate('products.productId', 'name price images').sort({createdAt: -1});
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).send("Error:" + error.message)
    }
}


// Admin: update status 
const updateOrdersStatusByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        if (!userId) return res.status(400).send('userId is required');
        if (!status) return res.status(400).send('status is required');

        const allowed = ['pending','processing','shipped','delivered','cancelled'];
        if (!allowed.includes(status)) return res.status(400).send('Invalid status');

        const result = await Order.updateMany({ userId }, { $set: { status } });

        const updatedOrders = await Order.find({ userId }).populate('userId', 'firstName email').populate('products.productId', 'name price images').sort({createdAt: -1});

        res.status(200).json({ modifiedCount: result.modifiedCount ?? result.nModified ?? 0, updatedOrders });
    } catch (error) {
        res.status(400).send('Error:' + error.message);
    }
}


module.exports = {createOrder, getUserOrders, getAllOrders, updateOrdersStatusByUser}
