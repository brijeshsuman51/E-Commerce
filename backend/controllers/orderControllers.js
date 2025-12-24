const Order = require('../model/order')
const User = require('../model/user')
const Product = require('../model/product')

// Create Order

const createOrder = async (req,res) => {
    try {
        const userId = req.result._id;
        const { products, shippingAddress, paymentMethod } = req.body;

        if(!products || !Array.isArray(products) || products.length === 0 || !shippingAddress){
            return res.status(400).send('Products and shipping address are required')
        }

        let totalAmount = 0;
        const orderProducts = [];

        for(const item of products){
            const product = await Product.findById(item.productId);
            if(!product || !product.isActive || product.stock < item.quantity){
                return res.status(400).send(`Product ${item.productId} not available or insufficient stock`)
            }
            const price = product.price;
            totalAmount += price * item.quantity;
            orderProducts.push({
                productId: item.productId,
                quantity: item.quantity,
                price: price
            })
            // Decrease stock
            product.stock -= item.quantity;
            await product.save();
        }

        const order = await Order.create({
            userId,
            products: orderProducts,
            totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || 'credit_card'
        })

        // Add to user's orders
        await User.findByIdAndUpdate(userId, {$push: {orders: order._id}})

        // Clear cart
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

// Update Order Status 

const updateOrderStatus = async (req,res) => {
    try {
        const {id} = req.params;
        const {status} = req.body;

        if(!id || !status){
            return res.status(400).send('Order ID and status are required')
        }

        const order = await Order.findByIdAndUpdate(id, {status}, {new:true})
        if(!order){
            return res.status(404).send('Order not found')
        }
        res.status(200).json(order)
    } catch (error) {
        res.status(400).send("Error:"+error.message)
    }
}



module.exports = {createOrder, getUserOrders, updateOrderStatus}