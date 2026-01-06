const express = require("express");
const reviewRouter = express.Router();
const { createReview, updateReview, deleteReview, getProductReviews, getUserReviews } = require("../controllers/reviewControllers");
const userMiddleware = require("../middleware/userMiddleware");

reviewRouter.post("/create", userMiddleware, createReview);
reviewRouter.put("/update/:id", userMiddleware, updateReview);
reviewRouter.delete("/delete/:id", userMiddleware, deleteReview);
reviewRouter.get("/product/:productId", getProductReviews);
reviewRouter.get("/user", userMiddleware, getUserReviews);

module.exports = reviewRouter;