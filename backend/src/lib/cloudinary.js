// Importa cloudinary v2
import { v2 as cloudinary } from 'cloudinary';

// Importa config do dotenv
import { config } from 'dotenv';

// Carrega variáveis de ambiente
config();

// Configura cloudinary com credenciais do .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;