require("dotenv").config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

console.log("Cloud Name:", process.env.CLOUDINARY_NAME);
console.log("API Key:", process.env.CLOUDINARY_KEY);
console.log("API Secret:", process.env.CLOUDINARY_SECRET);

module.exports = cloudinary;