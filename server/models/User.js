const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    collegeId: {
        type: String,
        required: [true, 'College ID is required'],
        unique: true,
        trim: true,
        uppercase: true,
        match: [/^[A-Z0-9]+$/, 'College ID must contain only letters and numbers']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    phone: {
        type: String,
        required: function () {
            return this.role === 'student';
        },
        match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    totalDue: {
        type: Number,
        default: 0,
        min: 0
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for faster queries
userSchema.index({collegeId: 1});
userSchema.index({role: 1});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Transform output (remove password from JSON)
userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

// Static method to find by college ID
userSchema.statics.findByCollegeId = function (collegeId) {
    return this.findOne({collegeId: collegeId.toUpperCase()});
};

module.exports = mongoose.model('User', userSchema);