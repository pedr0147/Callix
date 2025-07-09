// Importa mongoose e dotenv
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Liga à base de dados MongoDB
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

export default connectDB;
