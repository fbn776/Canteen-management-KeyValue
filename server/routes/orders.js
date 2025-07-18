const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Meal = require('../models/Meal');
const User = require('../models/User');
const {authenticateToken, requireAdmin, requireStudent} = require('../middleware/auth');
const {validateOrder} = require('../middleware/validation');

const router = express.Router();

// Create new order (students only)
router.post('/order', authenticateToken, requireStudent, validateOrder, async (req, res) => {

    try {
        const {meal_id, quantity = 1, notes} = req.body;

        // Find the meal
        const meal = await Meal.findById(meal_id)
        if (!meal) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found'
            });
        }

        // Check if meal is available for ordering
        if (!meal.canOrder()) {
            return res.status(400).json({
                success: false,
                message: 'Meal is not available for ordering'
            });
        }

        // Check if enough quantity is available
        if (meal.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${meal.quantity} items available`
            });
        }

        // Reduce meal quantity
        if (!meal.reduceQuantity(quantity)) {
            return res.status(400).json({
                success: false,
                message: 'Failed to reserve meal quantity'
            });
        }

        await meal.save();

        // Create order
        const order = new Order({
            userId: req.user._id,
            studentId: req.user.collegeId,
            mealId: meal._id,
            mealName: meal.name,
            price: meal.price,
            quantity,
            notes: notes?.trim()
        });

        await order.save();

        // Update user's total due
        await User.findByIdAndUpdate(
            req.user._id,
            {$inc: {totalDue: meal.price * quantity}},
        );

        // Populate the order for response
        await order.populate('mealId', 'name category description');

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to place order',
            error: error.message
        });
    }
});

// Get user's orders (students only)
router.get('/orders/my', authenticateToken, requireStudent, async (req, res) => {
    try {
        const {page = 1, limit = 50, status} = req.query;
        const skip = (page - 1) * limit;

        let query = {userId: req.user._id};

        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate('mealId', 'name category description')
            .sort({orderDate: -1})
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            data: orders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Fetch user orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

// Get all orders (admin only)
router.get('/orders/all', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const {page = 1, limit = 100, status, date, studentId} = req.query;
        const skip = (page - 1) * limit;

        let query = {};

        if (status) {
            query.status = status;
        }

        if (studentId) {
            query.studentId = studentId.toUpperCase();
        }

        if (date) {
            const targetDate = new Date(date);
            targetDate.setHours(0, 0, 0, 0);
            const nextDay = new Date(targetDate);
            nextDay.setDate(nextDay.getDate() + 1);

            query.orderDate = {
                $gte: targetDate,
                $lt: nextDay
            };
        }

        const orders = await Order.find(query)
            .populate('userId', 'collegeId phone')
            .populate('mealId', 'name category description')
            .sort({orderDate: -1})
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            data: orders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Fetch all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

// Get today's orders (admin only)
router.get('/orders/today', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const orders = await Order.getTodaysOrders();

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Fetch today orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch today\'s orders',
            error: error.message
        });
    }
});

// Get pending dues (admin only)
router.get('/orders/dues', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const dues = await Order.getPendingDues();

        // Group by student
        const groupedDues = dues.reduce((acc, order) => {
            const studentId = order.studentId;
            if (!acc[studentId]) {
                acc[studentId] = {
                    studentId,
                    phone: order.userId?.phone,
                    orders: [],
                    totalDue: 0
                };
            }
            acc[studentId].orders.push(order);
            acc[studentId].totalDue += order.price * order.quantity;
            return acc;
        }, {});

        res.json({
            success: true,
            data: Object.values(groupedDues)
        });
    } catch (error) {
        console.error('Fetch dues error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending dues',
            error: error.message
        });
    }
});

// Update order status (admin only)
router.put('/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const {status} = req.body;

        if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.status = status;
        if (status === 'completed') {
            order.completedAt = new Date();
        }

        await order.save();

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
});

// Mark payment as paid (admin only)
router.put('/orders/:id/payment', authenticateToken, requireAdmin, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {paymentStatus} = req.body;

        if (!['pending', 'paid', 'failed'].includes(paymentStatus)) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Invalid payment status'
            });
        }

        const order = await Order.findById(req.params.id).session(session);
        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const oldPaymentStatus = order.paymentStatus;
        order.paymentStatus = paymentStatus;
        await order.save({session});

        // Update user's total due if payment status changed
        if (oldPaymentStatus !== paymentStatus) {
            const totalAmount = order.price * order.quantity;

            if (oldPaymentStatus === 'pending' && paymentStatus === 'paid') {
                // Reduce due amount
                await User.findByIdAndUpdate(
                    order.userId,
                    {$inc: {totalDue: -totalAmount}},
                    {session}
                );
            } else if (oldPaymentStatus === 'paid' && paymentStatus === 'pending') {
                // Increase due amount
                await User.findByIdAndUpdate(
                    order.userId,
                    {$inc: {totalDue: totalAmount}},
                    {session}
                );
            }
        }

        await session.commitTransaction();

        res.json({
            success: true,
            message: 'Payment status updated successfully',
            data: order
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Update payment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update payment status',
            error: error.message
        });
    } finally {
        session.endSession();
    }
});

// Get order statistics (admin only)
router.get('/orders/stats/summary', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const stats = await Order.aggregate([
            {
                $match: {
                    orderDate: {$gte: today, $lt: tomorrow}
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: {$sum: 1},
                    totalRevenue: {$sum: {$multiply: ['$price', '$quantity']}},
                    pendingOrders: {
                        $sum: {$cond: [{$eq: ['$status', 'pending']}, 1, 0]}
                    },
                    completedOrders: {
                        $sum: {$cond: [{$eq: ['$status', 'completed']}, 1, 0]}
                    },
                    pendingPayments: {
                        $sum: {
                            $cond: [
                                {$eq: ['$paymentStatus', 'pending']},
                                {$multiply: ['$price', '$quantity']},
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const result = stats[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            pendingOrders: 0,
            completedOrders: 0,
            pendingPayments: 0
        };

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Order stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order statistics',
            error: error.message
        });
    }
});

// Cancel order (students can cancel their own pending orders)
router.delete('/orders/:id', authenticateToken, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(req.params.id).session(session);
        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check permissions
        if (req.user.role === 'student' && order.userId.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            return res.status(403).json({
                success: false,
                message: 'You can only cancel your own orders'
            });
        }

        // Can only cancel pending orders
        if (order.status !== 'pending') {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Can only cancel pending orders'
            });
        }

        // Restore meal quantity
        await Meal.findByIdAndUpdate(
            order.mealId,
            {$inc: {quantity: order.quantity}},
            {session}
        );

        // Update user's total due
        const totalAmount = order.price * order.quantity;
        await User.findByIdAndUpdate(
            order.userId,
            {$inc: {totalDue: -totalAmount}},
            {session}
        );

        // Cancel the order
        order.status = 'cancelled';
        await order.save({session});

        await session.commitTransaction();

        res.json({
            success: true,
            message: 'Order cancelled successfully'
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Cancel order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel order',
            error: error.message
        });
    } finally {
        session.endSession();
    }
});

module.exports = router;