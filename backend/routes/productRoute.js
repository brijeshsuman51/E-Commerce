const express = require("express");
const productRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware')
const {createProduct,updateProduct,deleteProduct,getProductById,getAllProducts,getProductsByCategory} = require("../controllers/productControllers")
const userMiddleware = require("../middleware/userMiddleware")


productRouter.post("/create",userMiddleware,createProduct);
productRouter.put("/update/:id",userMiddleware,updateProduct)
productRouter.delete("/delete/:id",userMiddleware,deleteProduct)

productRouter.get("/getAllProducts",getAllProducts)
productRouter.get("/getProductById/:id",getProductById)
productRouter.get("/category/:category",getProductsByCategory)


module.exports = productRouter;