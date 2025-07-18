const express = require('express');
const Meal = require('../models/Meal');
const {authenticateToken, requireAdmin} = require('../middleware/auth');
const {validateMeal} = require('../middleware/validation');

const router = express.Router();

// Get today's meals (public endpoint)
router.get('/meals/today', async (req, res) => {
    try {
        const meals = await Meal.getTodaysMeals();

        res.json({
            success: true,
            data: meals.map(meal => ({
                _id: meal._id,
                name: meal.name,
                description: meal.description,
                price: meal.price,
                quantity: meal.quantity,
                category: meal.category,
                status: meal.status
            }))
        });
    } catch (error) {
        console.error('Fetch meals error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch meals',
            error: error.message
        });
    }
});

// Get all meals (admin only)
router.get('/meals', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const {page = 1, limit = 50, date} = req.query;
        const skip = (page - 1) * limit;

        let query = {};

        if (date) {
            const targetDate = new Date(date);
            targetDate.setHours(0, 0, 0, 0);
            const nextDay = new Date(targetDate);
            nextDay.setDate(nextDay.getDate() + 1);

            query.date = {
                $gte: targetDate,
                $lt: nextDay
            };
        }

        const meals = await Meal.find(query)
            .populate('createdBy', 'collegeId')
            .sort({createdAt: -1})
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Meal.countDocuments(query);

        res.json({
            success: true,
            data: meals,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Fetch all meals error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch meals',
            error: error.message
        });
    }
});

// Get single meal by ID
router.get('/meals/:id', async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id)
            .populate('createdBy', 'collegeId');

        if (!meal) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found'
            });
        }

        res.json({
            success: true,
            data: meal
        });
    } catch (error) {
        console.error('Fetch meal error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch meal',
            error: error.message
        });
    }
});

// Create new meal (admin only)
router.post('/meals', authenticateToken, requireAdmin, validateMeal, async (req, res) => {
    try {
        const {name, description, price, quantity, category} = req.body;

        const meal = new Meal({
            name: name.trim(),
            description: description?.trim(),
            price,
            quantity,
            category: category || 'meal',
            originalQuantity: quantity,
            createdBy: req.user._id
        });

        await meal.save();

        res.status(201).json({
            success: true,
            message: 'Meal created successfully',
            data: meal
        });
    } catch (error) {
        console.error('Create meal error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create meal',
            error: error.message
        });
    }
});

// Update meal (admin only)
router.put('/meals/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const {name, description, price, quantity, category, isAvailable} = req.body;

        const meal = await Meal.findById(req.params.id);
        if (!meal) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found'
            });
        }

        // Update fields if provided
        if (name !== undefined) meal.name = name.trim();
        if (description !== undefined) meal.description = description?.trim();
        if (price !== undefined) meal.price = price;
        if (quantity !== undefined) meal.quantity = quantity;
        if (category !== undefined) meal.category = category;
        if (isAvailable !== undefined) meal.isAvailable = isAvailable;

        await meal.save();

        res.json({
            success: true,
            message: 'Meal updated successfully',
            data: meal
        });
    } catch (error) {
        console.error('Update meal error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update meal',
            error: error.message
        });
    }
});

// Delete meal (admin only)
router.delete('/meals/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id);
        if (!meal) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found'
            });
        }

        // Soft delete by marking as unavailable
        meal.isAvailable = false;
        await meal.save();

        res.json({
            success: true,
            message: 'Meal deleted successfully'
        });
    } catch (error) {
        console.error('Delete meal error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete meal',
            error: error.message
        });
    }
});

// Get meal statistics (admin only)
router.get('/meals/stats/summary', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const stats = await Meal.aggregate([
            {
                $match: {
                    date: {$gte: today, $lt: tomorrow}
                }
            },
            {
                $group: {
                    _id: null,
                    totalMeals: {$sum: 1},
                    totalQuantity: {$sum: '$originalQuantity'},
                    remainingQuantity: {$sum: '$quantity'},
                    totalValue: {$sum: {$multiply: ['$price', '$originalQuantity']}},
                    availableMeals: {
                        $sum: {
                            $cond: [{$and: ['$isAvailable', {$gt: ['$quantity', 0]}]}, 1, 0]
                        }
                    }
                }
            }
        ]);

        const result = stats[0] || {
            totalMeals: 0,
            totalQuantity: 0,
            remainingQuantity: 0,
            totalValue: 0,
            availableMeals: 0
        };

        result.soldQuantity = result.totalQuantity - result.remainingQuantity;

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Meal stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch meal statistics',
            error: error.message
        });
    }
});

module.exports = router;