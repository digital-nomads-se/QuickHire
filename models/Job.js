import mongoose from 'mongoose';
import logger from '../Utils/logger.js';

const JobSchema = new mongoose.Schema({

    userEmail: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    job_category: {
        type: String,
        required: true,
    },
    job_type: {
        type: String,
        required: true,
        trim: true,
    },
    job_experience: {
        type: String,
        required: true,
    },
    job_vacancy: {
        type: Number,
        required: true,
    },
    job_deadline: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

// Add a pre-save hook to log when a new Job instance is saved
JobSchema.pre('save', function (next) {
    logger.info('New Job instance saved', this);
    next();
});

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

export default Job;