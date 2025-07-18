const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Meal name is required'],
        trim: true,
        maxlength: [100, 'Meal name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [1, 'Price must be at least ₹1'],
        max: [1000, 'Price cannot exceed ₹1000']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        max: [500, 'Quantity cannot exceed 500']
    },
    originalQuantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['meal', 'snack', 'beverage'],
        default: 'meal'
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
mealSchema.index({date: 1, isAvailable: 1});
mealSchema.index({createdBy: 1});

// Virtual for availability status
mealSchema.virtual('status').get(function () {
    if (!this.isAvailable) return 'unavailable';
    if (this.quantity === 0) return 'out_of_stock';
    if (this.quantity <= 5) return 'low_stock';
    return 'available';
});

// Method to check if meal is available for ordering
mealSchema.methods.canOrder = function () {
    return this.isAvailable && this.quantity > 0;
};

// Method to reduce quantity when ordered
mealSchema.methods.reduceQuantity = function (amount = 1) {
    if (this.quantity >= amount) {
        this.quantity -= amount;
        return true;
    }
    return false;
};

// Static method to get today's meals
mealSchema.statics.getTodaysMeals = function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.find({
        date: {
            $gte: today,
            $lt: tomorrow
        },
        isAvailable: true
    }).sort({createdAt: -1});
};

// Pre-save middleware to set originalQuantity
mealSchema.pre('save', function (next) {
    if (this.isNew) {
        this.originalQuantity = this.quantity;
    }
    next();
});

module.exports = mongoose.model('Meal', mealSchema);