const express = require("express");
const orderRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {createOrder, getUserOrders, getAllOrders, updateOrdersStatusByUser} = require("../controllers/orderControllers")

orderRouter.post("/createOrder",userMiddleware,createOrder)
orderRouter.get("/myorders",userMiddleware,getUserOrders)
orderRouter.put("/user/:userId/status", adminMiddleware, updateOrdersStatusByUser)
orderRouter.get("/all",adminMiddleware,getAllOrders)

module.exports = orderRouter;