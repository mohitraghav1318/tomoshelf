const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,

    params: async (req, file) => {

        let folder = "tomoshelf/books";
        let resource_type = "auto";

        if (file.fieldname === "cover") {
            folder = "tomoshelf/covers";
            resource_type = "image";
        }

        if (file.fieldname === "pdf") {
            folder = "tomoshelf/pdfs";
            resource_type = "raw";   // IMPORTANT
        }

        return {
            folder,
            resource_type,
            allowed_formats: ["jpg", "jpeg", "png", "pdf"]
        };
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "application/pdf"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only images and PDFs allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 }
}).fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 }
]);

module.exports = upload;