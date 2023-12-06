import mongoose from 'mongoose';
import logger from '../Utils/logger.js';

// Define the ApplyJob schema
const ApplyJobSchema = new mongoose.Schema({

    userEmail: {
        type: String,
        required: true,
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    cv: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'accepted', 'rejected']
    }
}, { timestamps: true });

// Add a pre-save hook to log when a new ApplyJob instance is saved
ApplyJobSchema.pre('save', function (next) {
    logger.info('New ApplyJob instance saved', this);
    next();
});

const AppliedJob = mongoose.models.AppliedJobStatus || mongoose.model('AppliedJobStatus', ApplyJobSchema);

export default AppliedJob;