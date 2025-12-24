const User = require("../model/user")
const Product = require("../model/product")

// Add to Cart

const addToCart = async (req,res) => {
    try {
        const userId = req.result._id;
        const {productId, quantity} = req.body;

        if(!productId || !quantity || quantity < 1){
            return res.status(400).send('Product ID and quantity required')
        }

        const product = await Product.findById(productId);
        if(!product || !product.isActive){
            return res.status(404).send('Product not found')
        }

        const user = await User.findById(userId);
        const cartItem = user.cart.find(item => item.productId.toString() === productId);

        if(cartItem){
            cartItem.quantity += quantity;
        } else {
            user.cart.push({productId, quantity});
        }

        await user.save();
        
        const populatedUser = await User.findById(userId).populate('cart.productId', 'name price images stock');
        res.status(200).json({message: 'Added to cart', cart: populatedUser.cart});

    } catch (error) {
        res.status(400).send("Error:"+error.message)
    }
}

// Remove from Cart

const removeFromCart = async (req,res) => {
    try {
        const userId = req.result._id;
        const {productId} = req.body;

        if(!productId){
            return res.status(400).send('Product ID required')
        }

        const user = await User.findById(userId);
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);

        await user.save();
        
        const populatedUser = await User.findById(userId).populate('cart.productId', 'name price images stock');
        res.status(200).json({message: 'Removed from cart', cart: populatedUser.cart});

    } catch (error) {
        res.status(400).send("Error:"+error.message)
    }
}

// Get Cart

const getCart = async (req,res) => {
    try {
        const userId = req.result._id;
        const user = await User.findById(userId).populate('cart.productId', 'name price images stock');
        res.status(200).json(user.cart);
    } catch (error) {
        res.status(400).send("Error:"+error.message)
    }
}

// Update Cart Item

const updateCartItem = async (req,res) => {
    try {
        const userId = req.result._id;
        const {productId, quantity} = req.body;

        if(!productId || quantity < 1){
            return res.status(400).send('Product ID and valid quantity required')
        }

        const user = await User.findById(userId);
        const cartItem = user.cart.find(item => item.productId.toString() === productId);

        if(!cartItem){
            return res.status(404).send('Item not in cart')
        }

        cartItem.quantity = quantity;
        await user.save();
        
        const populatedUser = await User.findById(userId).populate('cart.productId', 'name price images stock');
        res.status(200).json({message: 'Cart updated', cart: populatedUser.cart});

    } catch (error) {
        res.status(400).send("Error:"+error.message)
    }
}


module.exports = {addToCart, removeFromCart, getCart, updateCartItem}