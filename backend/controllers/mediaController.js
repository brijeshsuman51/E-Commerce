const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

// Create Video Solution 

const createVideo = async (req,res) => {
    try {
        const {id} = req.params;
        const userId = req.result._id;

        const product = await Product.findById(id)
        if(!product){
            return res.json({error:"Product not found"})
        }

        const timestamp = Math.round(new Date().getTime() / 1000)
        const publicId = `coderclash-solutions/${id}/${userId}_${timestamp}`

        const uploadParams = {
            timestamp:timestamp,
            public_id:publicId
        }

        const signature = cloudinary.utils.api_sign_request(
            uploadParams,
            process.env.CLOUDINARY_SECRET
        )

        res.json({
            signature,
            timestamp,
            public_id:publicId,
            api_key:process.env.CLOUDINARY_KEY,
            cloud_name:process.env.CLOUDINARY_NAME,
            upload_url:`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/video/upload`
        })
    } catch (error) {
        // console.error("Error for create video in cloudinary",error)
        res.json({error:'Failed to generate upload credentials'})
    }
}

// Save Video in Cloudinary 

const saveVideo = async (req,res) => {
    try {
        const{
            problemId,
            cloudinaryPublicId,
            secureUrl,
            duration
        } = req.body

        const userId = req.result._id;

        const cloudinaryResource = await cloudinary.api.resource(
            cloudinaryPublicId,
            {resource_type:'video'}
        )

        if(!cloudinaryResource){
            return res.json({error:'Video not found on cloudinary'})
        }

        const existingVideo = await Media.findOne({
            problemId,
            userId,
            cloudinaryPublicId
        })

        if(existingVideo){
            return res.json({error:"Video already exists"})
        }

        const thumbnailUrl = cloudinary.image(cloudinaryResource.public_id,{resource_type:'video'})

        const videoSolution = await Media.create({
            problemId,
            userId,
            cloudinaryPublicId,
            secureUrl,
            duration:cloudinaryResource.duration || duration,
            thumbnailUrl
        })

        res.json({
            message:"Video Solution saved Successfully",
            videoSolution:{
                id:videoSolution._id,
                thumbnailUrl:videoSolution.thumbnailUrl,
                duration:videoSolution.duration,
                uploadedAt:videoSolution.createdAt
            }
        })
    } catch (error) {
        // console.error("Error saving meta data",error)
        res.json({error:'Failed to save the video solution'})
    }
}

// Delete Video From Cloudinary and Problem 

const deleteVideo = async (req,res) => {
    try {
        const {id} = req.params;
        const userId = req.result._id;

        const media = await Media.findOneAndDelete({problemId:id})

        if(!media){
            return res.json({error:'Video not found'})
        }

        await cloudinary.uploader.destroy(media.cloudinaryPublicId,{resource_type:'video',invalidate:true})
        res.json({message:"Video deleted Successfully"})
    } catch (error) {
        // console.error('Error for deleting video:',error)
        res.json({error:"Failed to delete Video"})
    }
}

// Create Image Upload Signature
const createImageUpload = async (req, res) => {
    try {
        // 1. Check if Cloudinary Keys exist
        if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
            // console.log('Cloudinary not configured, returning mock data');
            return res.json({
                signature: 'mock_signature',
                timestamp: Math.round(new Date().getTime() / 1000),
                public_id: 'mock_public_id',
                api_key: 'mock_api_key',
                cloud_name: 'mock_cloud_name',
                upload_url: 'https://httpbin.org/post'
            });
        }
        
        // 2. SAFETY CHECK: Handle missing req.result
        // If the route doesn't have auth middleware, req.result is undefined. 
        // We use a fallback ID to prevent the crash.
        const userId = req.result ? req.result._id : `guest_${Math.floor(Math.random() * 10000)}`;
        
        const timestamp = Math.round(new Date().getTime() / 1000);
        const publicId = `ecommerce-products/${userId}_${timestamp}`;
        const folder = 'ecommerce-products';

        const uploadParams = {
            timestamp: timestamp,
            public_id: publicId,
            folder: folder
        };

        const signature = cloudinary.utils.api_sign_request(
            uploadParams,
            process.env.CLOUDINARY_SECRET
        );

        res.json({
            signature,
            timestamp,
            public_id: publicId,
            api_key: process.env.CLOUDINARY_KEY,
            cloud_name: process.env.CLOUDINARY_NAME,
            folder: folder, // Important: Send folder to frontend
            upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`
        });
    } catch (error) {
        // console.error("Error generating image upload credentials:", error);
        // Return the actual error message so you can see it in the frontend console
        res.status(500).json({ error: `Server Error: ${error.message}` });
    }
};

// --- FIXED SAVE IMAGE CONTROLLER ---
const saveImage = async (req, res) => {
    try {
        const { cloudinaryPublicId, secureUrl } = req.body;
        
        // Safety check for userId
        const userId = req.result ? req.result._id : null;

        if (cloudinaryPublicId === 'mock_public_id') {
            return res.json({
                message: "Image uploaded successfully",
                image: { publicId: cloudinaryPublicId, secureUrl: secureUrl || 'https://via.placeholder.com/300' }
            });
        }

        const cloudinaryResource = await cloudinary.api.resource(
            cloudinaryPublicId,
            { resource_type: 'image' }
        );

        if (!cloudinaryResource) {
            return res.status(404).json({ error: 'Image not found on Cloudinary' });
        }

        res.json({
            message: "Image verified successfully",
            image: {
                publicId: cloudinaryPublicId,
                secureUrl: secureUrl,
                uploadedAt: new Date()
            }
        });
    } catch (error) {
        // console.error("Error saving image metadata:", error);
        res.status(500).json({ error: `Save Failed: ${error.message}` });
    }
};

// Delete Image from Cloudinary
const deleteImage = async (req,res) => {
    try {
        const { publicId } = req.params;
        const userId = req.result._id;

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });

        res.json({ message: "Image deleted successfully" });
    } catch (error) {
        // console.error('Error deleting image:', error);
        res.json({ error: "Failed to delete image" });
    }
};


module.exports = {createVideo,saveVideo,deleteVideo, createImageUpload, saveImage, deleteImage}