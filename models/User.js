import mongoose from 'mongoose';
import logger from '../Utils/logger.js';

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

// Add a pre-save hook to log when a new User instance is saved
UserSchema.pre('save', function (next) {
    logger.info('New User instance saved', this);
    next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;