const express = require("express");
const cartRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const {addToCart, removeFromCart, getCart, updateCartItem} = require("../controllers/cartControllers")

cartRouter.post("/addCart",userMiddleware,addToCart)
cartRouter.post("/removeCart",userMiddleware,removeFromCart)
cartRouter.get("/getCart",userMiddleware,getCart)
cartRouter.put("/updateCartItem",userMiddleware,updateCartItem)


module.exports = cartRouter;