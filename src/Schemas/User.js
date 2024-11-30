const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    vatsimId: String,
    firstName: String,
    lastName: String,
    fullName: String,
    email: String,
    atcRating: String,
    pilotRating: String,
    ratingLong: String,
    ratingShort: String,
    ratingNumber: Number,
    discordId: String,
    discordUsername: String,
    roles: [String],
    nameFormat: {
        type: String,
        enum: ['fullName', 'firstInitialLastName', 'cidOnly'],
        default: 'fullName'
    }
}, { timestamps: true });

module.exports = () => {
    if (global.userConnection) {  // Use the global userConnection
        return global.userConnection.model('User', userSchema);
    }
    throw new Error('User database connection not established');
};