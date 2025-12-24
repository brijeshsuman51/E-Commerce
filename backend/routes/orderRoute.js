const express = require("express");
const orderRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {createOrder, getUserOrders, updateOrderStatus} = require("../controllers/orderControllers")

orderRouter.post("/createOrder",userMiddleware,createOrder)
orderRouter.get("/myorders",userMiddleware,getUserOrders)
orderRouter.put("/updateOrderStatus/:id",adminMiddleware,updateOrderStatus)

module.exports = orderRouter;