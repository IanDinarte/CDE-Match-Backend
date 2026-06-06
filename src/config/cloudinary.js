import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const folderName =
      file.fieldname === "logo" ? "cde-match-businesses" : "cde-match-members";

    return {
      folder: folderName,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [{ width: 1000, height: 1000, crop: "limit" }],
    };
  },
});

export const upload = multer({ storage: storage });

export const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;
  try {
    const urlParts = imageUrl.split("/");
    const folderIndex = urlParts.findIndex(
      (part) => part === "cde-match-members" || part === "cde-match-businesses",
    );
    
    if (folderIndex !== -1) {
      const publicIdWithExtension = urlParts.slice(folderIndex).join("/");
      const publicId = publicIdWithExtension.substring(
        0,
        publicIdWithExtension.lastIndexOf("."),
      );

      await cloudinary.uploader.destroy(publicId);
      console.log(`Cloudinary: Imagem ${publicId} apagada com sucesso.`);
    }
  } catch (err) {
    console.log("Erro ao apagar ficheiro do Cloudinary:", err.message);
  }
};
