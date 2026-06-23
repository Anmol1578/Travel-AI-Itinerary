// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");

// // 1. Initialize Cloudinary connection using environment variables
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // 2. Define the Cloudinary storage rules
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     // Dynamically check file extension type
//     const fileFormat = file.mimetype.split("/")[1];

//     return {
//       folder: "orbitra_travel_docs",
//       resource_type: "auto", // Essential to support both PDFs and Images seamlessly
//       format: fileFormat === "pdf" ? "pdf" : undefined, // Force explicit PDF mapping if applicable
//       public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
//     };
//   },
// });

// // 3. Configure Multer with strict security rules and a 5MB size ceiling
// const uploadCloud = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Enforce 5MB file limit rule
//   fileFilter: (req, file, cb) => {
//     // Immediately block malicious or unwanted file formats before they stream
//     if (
//       file.mimetype === "application/pdf" ||
//       file.mimetype.startsWith("image/")
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error("INVALID_FILE_TYPE"), false);
//     }
//   },
// });

// // 4. Export the configured Multer engine instance
// module.exports = uploadCloud;



const cloudinary = require("cloudinary").v2;

// 1. Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;