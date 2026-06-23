const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Give Cloudinary your keys from the .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Set up the storage rules
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'khetse_produce', // It will create this folder in your Cloudinary account!
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});

// 3. Create the Multer upload tool
const upload = multer({ storage: storage });

module.exports = upload;