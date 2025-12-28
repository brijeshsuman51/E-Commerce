const express = require("express");
const productRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware')
const {createProduct,updateProduct,deleteProduct,getProductById,getAllProducts,getProductsByCategory} = require("../controllers/productControllers")
const userMiddleware = require("../middleware/userMiddleware")


productRouter.post("/create",adminMiddleware,createProduct);
productRouter.put("/update/:id",adminMiddleware,updateProduct)
productRouter.delete("/delete/:id",adminMiddleware,deleteProduct)

productRouter.get("/getAllProducts",getAllProducts)
productRouter.get("/getProductById/:id",getProductById)
productRouter.get("/category/:category",getProductsByCategory)


module.exports = productRouter;