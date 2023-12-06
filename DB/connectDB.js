import mongoose from 'mongoose';
import logger from '../Utils/logger.js';

const connectDB = async () => {

    const connectionUrl = process.env.DB_URI;

    mongoose.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 120000 })
        .then(() => {
            logger.info(`Database connected successfully`);
        })
        .catch((err) => {
            logger.error(`Getting Error from DB connection ${err.message}`);
        });

    mongoose.set('strictQuery', false);
};

export default connectDB;