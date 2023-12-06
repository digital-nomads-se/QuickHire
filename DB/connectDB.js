import mongoose from 'mongoose';
import logger from '../Utils/logger.js';

// connecting to database
const connectDB = async () => {

    // Get the connection URL from the environment variables
    const connectionUrl = process.env.DB_URI;

    // Connect to the database
    mongoose.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true, bufferCommands: false, bufferTimeoutMS: 0 })
        .then(() => {
            console.log(`Database connected successfully`);
            logger.info(`Database connected successfully`);
        })
        .catch((err) => {
            console.log("Getting Error from DB connection" + err.message);
            logger.error(`Getting Error from DB connection ${err.message}`);
        });

    // Set mongoose to not enforce its default strict mode
    mongoose.set('strictQuery', false);
};

export default connectDB;