const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  studentId: {
    type: String,
    required: true,
    index: true
  },
  mealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal',
    required: true
  },
  mealName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: [1, 'Price must be at least ₹1']
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, 'Quantity must be at least 1'],
    max: [10, 'Cannot order more than 10 items at once']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  completedAt: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot exceed 200 characters']
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
orderSchema.index({ userId: 1, orderDate: -1 });
orderSchema.index({ status: 1, orderDate: -1 });
orderSchema.index({ studentId: 1, status: 1 });

// Virtual for total amount
orderSchema.virtual('totalAmount').get(function() {
  return this.price * this.quantity;
});

// Method to mark order as completed
orderSchema.methods.markCompleted = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Method to cancel order
orderSchema.methods.cancel = function() {
  if (this.status === 'pending') {
    this.status = 'cancelled';
    return this.save();
  }
  throw new Error('Cannot cancel order that is not pending');
};

// Static method to get user's orders
orderSchema.statics.getUserOrders = function(userId, limit = 50) {
  return this.find({ userId })
    .populate('mealId', 'name category')
    .sort({ orderDate: -1 })
    .limit(limit);
};

// Static method to get today's orders
orderSchema.statics.getTodaysOrders = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return this.find({
    orderDate: {
      $gte: today,
      $lt: tomorrow
    }
  }).populate('userId', 'collegeId phone')
    .populate('mealId', 'name category')
    .sort({ orderDate: -1 });
};

// Static method to get pending dues
orderSchema.statics.getPendingDues = function() {
  return this.find({
    paymentStatus: 'pending'
  }).populate('userId', 'collegeId phone')
    .sort({ orderDate: -1 });
};

module.exports = mongoose.model('Order', orderSchema);