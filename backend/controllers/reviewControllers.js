const Review = require("../model/review");
const Product = require("../model/product");

// Create Review

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.result._id;

    if (!productId || !rating || !comment) {
      return res
        .status(400)
        .json({ message: "Product ID, rating, and comment are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      rating,
      comment,
    });

    await updateProductRating(productId);

    res.status(201).json({
      message: "Review created successfully",
      review: await Review.findById(review._id).populate("user", "name"),
    });
  } catch (error) {
    // console.error("Error creating review:", error.message);
    res
      .status(400)
      .json({ message: "Failed to create review", error: error.message });
  }
};

// Update Review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.result._id;

    if (!id) {
      return res.status(400).json({ message: "Review ID is required" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own reviews" });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { ...(rating && { rating }), ...(comment && { comment }) },
      { new: true, runValidators: true }
    ).populate("user", "name");

    await updateProductRating(review.product);

    res.status(200).json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    // console.error("Error updating review:", error.message);
    res
      .status(400)
      .json({ message: "Failed to update review", error: error.message });
  }
};

// Delete Review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.result._id;

    if (!id) {
      return res.status(400).json({ message: "Review ID is required" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (
      review.user.toString() !== userId.toString() &&
      req.result.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You can only delete your own reviews" });
    }

    await Review.findByIdAndDelete(id);

    await updateProductRating(review.product);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    // console.error("Error deleting review:", error.message);
    res
      .status(400)
      .json({ message: "Failed to delete review", error: error.message });
  }
};

// Get Reviews for a Product

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const reviews = await Review.find({
      product: productId,
      isActive: true,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    // console.error("Error fetching reviews:", error.message);
    res
      .status(400)
      .json({ message: "Failed to fetch reviews", error: error.message });
  }
};

// Get User's Reviews
const getUserReviews = async (req, res) => {
  try {
    const userId = req.result._id;

    const reviews = await Review.find({
      user: userId,
      isActive: true,
    })
      .populate("product", "name images")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    // console.error("Error fetching user reviews:", error.message);
    res
      .status(400)
      .json({ message: "Failed to fetch reviews", error: error.message });
  }
};

// update product rating
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId, isActive: true });

    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, { rating: 0, numReviews: 0 });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(averageRating * 10) / 10,
      numReviews: reviews.length,
    });
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  getUserReviews,
  updateProductRating,
};
