const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = (buffer, folder) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) reject(err);
      else resolve(result.secure_url);
    }).end(buffer);
  });

const deleteImage = async (url) => {
  if (!url?.includes('cloudinary')) return;
  const afterUpload = url.split('/upload/')[1];
  const withoutVersion = afterUpload.replace(/^v\d+\//, '');
  const publicId = withoutVersion.replace(/\.[^/.]+$/, '');
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadImage, deleteImage };
