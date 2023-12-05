import mongoose from 'mongoose';
import Job from './Job'
import logger from '../Utils/logger.js';

// Define the bookMarkSchema
const bookMarkSchema = new mongoose.Schema({

    userEmail: {
        type: String,
        required: true,
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    },


}, { timestamps: true });

// Add a pre-save hook to log when a new bookMarkJob instance is saved
bookMarkSchema.pre('save', function (next) {
    logger.info('New bookMarkJob instance saved', this);
    next();
});

const bookMarkJob = mongoose.models.BookMarkJob || mongoose.model('BookMarkJob', bookMarkSchema);

export default bookMarkJob;