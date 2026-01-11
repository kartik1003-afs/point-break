const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const Food = require('./models/Food');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Static Folder for Images
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Config
const cloudConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

console.log('--- Cloudinary Config Check ---');
console.log('Cloud Name:', cloudConfig.cloud_name ? '✅ Loaded' : '❌ Missing');
console.log('API Key:', cloudConfig.api_key ? '✅ Loaded' : '❌ Missing');
console.log('API Secret:', cloudConfig.api_secret ? '✅ Loaded' : '❌ Missing');

cloudinary.config(cloudConfig);

// Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'food-app',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    }
});

const upload = multer({ storage: storage });

// Middleware to check for Admin Password
const checkAdmin = (req, res, next) => {
    const adminPassword = req.headers['x-admin-password'];
    if (adminPassword === 'pointbreak') { // Simple check
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Incorrect Admin Password' });
    }
};

// Routes

// GET: All foods
app.get('/api/foods', async (req, res) => {
    try {
        const foods = await Food.find().sort({ createdAt: -1 });
        res.json(foods);
    } catch (err) {
        console.error('SERVER ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST: Add food
app.post('/api/foods', checkAdmin, upload.array('images', 10), async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Name and at least one Image are required' });
        }

        const imageFilenames = req.files.map(file => file.path);

        const newFood = new Food({
            name,
            images: imageFilenames
        });

        const savedFood = await newFood.save();
        res.status(201).json(savedFood);
    } catch (err) {
        console.error('SERVER ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});


// POST: Append images to existing food
app.post('/api/foods/:id/images', checkAdmin, upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images provided' });
        }

        const food = await Food.findById(req.params.id);
        if (!food) return res.status(404).json({ message: 'Food not found' });

        const newImages = req.files.map(file => file.path);
        food.images.push(...newImages);

        const savedFood = await food.save();
        res.json(savedFood);
    } catch (err) {
        console.error('SERVER ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Remove food
app.delete('/api/foods/:id', checkAdmin, async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) return res.status(404).json({ message: 'Food not found' });

        // Note: For production, we should delete from Cloudinary here using the public_id
        // const publicId = getPublicIdFromUrl(food.images[i]);
        // await cloudinary.uploader.destroy(publicId);

        await Food.findByIdAndDelete(req.params.id);
        res.json({ message: 'Food deleted' });
    } catch (err) {
        console.error('SERVER ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
