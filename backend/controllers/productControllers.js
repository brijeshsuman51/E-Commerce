const Product = require("../model/product")
const { getPriceForCountry } = require("../utils/pricing")

// Create Product

const createProduct = async (req,res) => {
    try {
        const productInfo = await Product.create({
            ...req.body,
            createdBy : req.result._id,
        })
        res.status(201).json({ message: "Product Created Successfully", product: productInfo });
    } catch (error) {
        // console.error("Error creating product:", error.message);
        res.status(400).json({ message: "Failed to create product.", error: error.message });
    }
}

// Update Product

const updateProduct = async (req,res) => {
    try {
        const {id} = req.params;
        const userId = req.result._id;

        if(!id)
            return res.status(400).send("Missing ID Fields")

        const product = await Product.findById(id)
        if(!product){
            return res.status(404).send("Product not found")
        }

        if(product.createdBy.toString() !== userId.toString() && req.result.role !== 'admin'){
            return res.status(403).send("You don't have permission to update this product")
        }

        const updatedProduct = await Product.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
        res.status(200).json(updatedProduct)

    } catch (error) {
        res.status(400).send("Error:"+error.message)
    }

}

// Delete Product

const deleteProduct = async (req,res) => {

    const { id } = req.params;
    const userId = req.result._id;

    try {
        if(!id){
            return res.status(400).send("ID is Missing")
        }

        const product = await Product.findById(id)
        if(!product){
            return res.status(404).send("Product not found")
        }

        if(product.createdBy.toString() !== userId.toString() && req.result.role !== 'admin'){
            return res.status(403).send("You don't have permission to delete this product")
        }

        const deletedProduct = await Product.findByIdAndDelete(id)

        if(!deletedProduct){
            return res.status(404).send("Product not found")
        }
        res.status(200).send("Product Deleted Successfully")
    } catch (error) {
        res.status(400).send("Error:"+error.message)
    }
}

// Get Product By ID

const getProductById = async (req,res) => {
    const {id} = req.params
    try {
        if(!id){
            return res.status(400).send("Id is not present")
        }
        const product = await Product.findById(id)

        if(!product){
            return res.status(404).send("Product not found")
        }

        res.status(200).json(product)
    } catch (error) {
        res.status(400).send("Error:"+error.message)
    }

}

// Get All Products
const getAllProducts = async (req,res) => {
    try {
        const products = await Product.find({isActive:true}).select('_id name price category images stock brand rating numReviews')
        if(products.length==0){
            return res.status(404).send("No products found")
        }

        res.status(200).json(products)
    } catch (error) {
        res.status(400).send("Error:"+error.message)
    }
}

// Get Products by Category
const getProductsByCategory = async (req,res) => {
    try {
        const {category} = req.params;
        const products = await Product.find({category, isActive:true}).select('_id name price images stock brand rating numReviews')
        res.status(200).json(products)
    } catch (error) {
        res.status(400).send("Error:"+error.message)
    }
}


module.exports = {createProduct,updateProduct,deleteProduct,getProductById,getAllProducts,getProductsByCategory}
