import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cde-match-members',
    allowed_formats: ['jpg', 'png', 'jpeg','webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }] 
  },
});

export const upload = multer({ storage: storage });