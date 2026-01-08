const express = require("express");
const freshSaleRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware');
const { createFreshSale, getCurrentFreshSale, getAllFreshSales, deleteFreshSale, stopCurrentFreshSale } = require("../controllers/freshSaleControllers");


freshSaleRouter.get("/current", getCurrentFreshSale);
freshSaleRouter.post("/create", adminMiddleware, createFreshSale);
freshSaleRouter.get("/all", adminMiddleware, getAllFreshSales);
freshSaleRouter.delete("/delete/:id", adminMiddleware, deleteFreshSale);
freshSaleRouter.put("/stop", adminMiddleware, stopCurrentFreshSale);

module.exports = freshSaleRouter;