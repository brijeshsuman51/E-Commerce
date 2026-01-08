const FreshSale = require("../model/freshSale");
const Product = require("../model/product");

// Create Fresh Sale
const createFreshSale = async (req, res) => {
    
    try {
        
        const { productId, discount, endTime } = req.body;

        if (!productId || !discount || !endTime) {
            return res.status(400).json({ message: "Missing required fields: productId, discount, endTime" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (req.result.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can create fresh sales" });
        }

        await FreshSale.updateMany({ isActive: true }, { isActive: false });


        const freshSale = await FreshSale.create({
            productId,
            discount: parseInt(discount),
            endTime: new Date(endTime),
            startTime: new Date(),
            createdBy: req.result._id
        });

        res.status(201).json({
            message: "Fresh sale created successfully",
            freshSale: {
                _id: freshSale._id,
                productId: freshSale.productId,
                discount: freshSale.discount,
                startTime: freshSale.startTime,
                endTime: freshSale.endTime,
                isActive: freshSale.isActive
            }
        });
    } catch (error) {
        res.status(400).json({ message: "Failed to create fresh sale", error: error.message });
    }
};

// Get Current Fresh Sale
const getCurrentFreshSale = async (req, res) => {
    try {
        const currentTime = new Date();

        const freshSale = await FreshSale.findOne({
            isActive: true,
            endTime: { $gt: currentTime }
        }).populate('productId', 'name price images category brand rating');

        if (!freshSale) {
            return res.status(200).json({ message: "No active fresh sale", freshSale: null });
        }

        const timeRemaining = freshSale.endTime - currentTime;
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        res.status(200).json({
            freshSale: {
                _id: freshSale._id,
                productId: freshSale.productId._id,
                product: freshSale.productId,
                discount: freshSale.discount,
                startTime: freshSale.startTime,
                endTime: freshSale.endTime,
                timeRemaining,
                timeString,
                isActive: true
            }
        });
    } catch (error) {
        res.status(400).json({ message: "Failed to get fresh sale", error: error.message });
    }
};

// Get All Fresh Sales
const getAllFreshSales = async (req, res) => {
    try {
        if (req.result.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can view all fresh sales" });
        }

        const freshSales = await FreshSale.find({})
            .populate('productId', 'name price images category brand')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ freshSales });
    } catch (error) {
        res.status(400).json({ message: "Failed to get fresh sales", error: error.message });
    }
};

// Delete/Stop Fresh Sale
const deleteFreshSale = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.result.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can delete fresh sales" });
        }

        const freshSale = await FreshSale.findById(id);
        if (!freshSale) {
            return res.status(404).json({ message: "Fresh sale not found" });
        }

        await FreshSale.findByIdAndDelete(id);

        res.status(200).json({ message: "Fresh sale deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Failed to delete fresh sale", error: error.message });
    }
};

// Stop Current Fresh Sale
const stopCurrentFreshSale = async (req, res) => {
    try {
        if (req.result.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can stop fresh sales" });
        }

        const result = await FreshSale.updateMany(
            { isActive: true },
            { isActive: false }
        );

        res.status(200).json({
            message: "Current fresh sale stopped successfully",
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(400).json({ message: "Failed to stop fresh sale", error: error.message });
    }
};

module.exports = {
    createFreshSale,
    getCurrentFreshSale,
    getAllFreshSales,
    deleteFreshSale,
    stopCurrentFreshSale
};