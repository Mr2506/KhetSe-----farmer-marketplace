const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary and get the URL back
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Cloudinary magically returns the secure URL of the uploaded image!
    res.status(200).json({ 
      message: 'Image uploaded successfully',
      imageUrl: req.file.path 
    });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

module.exports = router;