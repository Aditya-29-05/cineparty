import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cineparty';
    const conn = await mongoose.connect(mongoUri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    logger.warn('Please ensure MongoDB is running or configure MONGO_URI in server/.env');
  }
};
