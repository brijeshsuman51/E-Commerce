const express = require('express')
const adminMiddleware = require('../middleware/adminMiddleware')
const mediaRouter = express.Router()
const { createImageUpload, saveImage, deleteImage } = require('../controllers/mediaController')



// Image routes
mediaRouter.get('/image/create', createImageUpload)
mediaRouter.post('/image/save', adminMiddleware, saveImage)
mediaRouter.delete('/image/delete/:publicId', adminMiddleware, deleteImage)


module.exports = mediaRouter