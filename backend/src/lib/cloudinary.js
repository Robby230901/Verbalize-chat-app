import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config(); // Carica variabili d'ambiente

cloudinary.config({
  cloud_name: process.env.CLOUDYNARY_CLOUD_NAME,
  api_key: process.env.CLOUDYNARY_API_KEY,
  api_secret: process.env.CLOUDYNARY_API_SECRET,
});
export default cloudinary;