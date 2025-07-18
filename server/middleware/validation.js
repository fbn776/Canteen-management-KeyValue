const validateRegistration = (req, res, next) => {
  const { collegeId, password, phone } = req.body;

  // Validate college ID
  if (!collegeId || typeof collegeId !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'College ID is required and must be a string'
    });
  }

  if (collegeId.length < 3 || collegeId.length > 20) {
    return res.status(400).json({
      success: false,
      message: 'College ID must be between 3 and 20 characters'
    });
  }

  if (!/^[A-Za-z0-9]+$/.test(collegeId)) {
    return res.status(400).json({
      success: false,
      message: 'College ID must contain only letters and numbers'
    });
  }

  // Validate password
  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Password is required and must be a string'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  // Validate phone (required for students)
  if (phone) {
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be exactly 10 digits'
      });
    }
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { collegeId, password } = req.body;

  if (!collegeId || !password) {
    return res.status(400).json({
      success: false,
      message: 'College ID and password are required'
    });
  }

  if (typeof collegeId !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'College ID and password must be strings'
    });
  }

  next();
};

const validateMeal = (req, res, next) => {
  const { name, price, quantity, description } = req.body;

  // Validate name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Meal name is required and must be a non-empty string'
    });
  }

  if (name.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Meal name cannot exceed 100 characters'
    });
  }

  // Validate price
  if (!price || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Price is required and must be a positive number'
    });
  }

  if (price > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Price cannot exceed ₹1000'
    });
  }

  // Validate quantity
  if (quantity === undefined || typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({
      success: false,
      message: 'Quantity is required and must be a non-negative number'
    });
  }

  if (quantity > 500) {
    return res.status(400).json({
      success: false,
      message: 'Quantity cannot exceed 500'
    });
  }

  // Validate description (optional)
  if (description && (typeof description !== 'string' || description.length > 500)) {
    return res.status(400).json({
      success: false,
      message: 'Description must be a string and cannot exceed 500 characters'
    });
  }

  next();
};

const validateOrder = (req, res, next) => {
  const { meal_id, quantity } = req.body;

  // Validate meal_id
  if (!meal_id || typeof meal_id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Meal ID is required and must be a string'
    });
  }

  // Validate quantity (optional, defaults to 1)
  if (quantity !== undefined) {
    if (typeof quantity !== 'number' || quantity < 1 || quantity > 10) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a number between 1 and 10'
      });
    }
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateMeal,
  validateOrder
};