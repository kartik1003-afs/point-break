const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Food = require('./models/Food');

async function resetDB() {
    try {
        console.log('Connecting...');
        await mongoose.connect('mongodb://localhost:27017/foodApp');
        console.log('Connected.');

        // Clear Collection
        await Food.deleteMany({});
        console.log('Collection Cleared.');

        // Clear Uploads Folder
        const uploadsDir = path.join(__dirname, 'uploads');
        fs.readdir(uploadsDir, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(uploadsDir, file), err => {
                    if (err) throw err;
                });
            }
            console.log('Uploads folder cleared.');
            process.exit(0);
        });

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

resetDB();
