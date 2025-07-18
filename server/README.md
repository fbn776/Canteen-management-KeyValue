# St. Xavier's Canteen Management System - Backend

A comprehensive Node.js backend API for managing canteen operations at St. Xavier's Engineering College.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Meal Management**: CRUD operations for daily meals with inventory tracking
- **Order System**: Complete order lifecycle management with real-time inventory updates
- **Payment Tracking**: Track pending dues and payment status
- **Admin Dashboard**: Comprehensive analytics and management tools
- **Data Validation**: Robust input validation and error handling
- **Security**: Rate limiting, CORS protection, and secure password hashing

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, express-rate-limit
- **Validation**: Custom middleware with comprehensive checks

## Installation

1. **Clone and navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Copy `.env.example` to `.env` and configure:
   ```env
   MONGODB_URI=mongodb://localhost:27017/st_xaviers_canteen
   JWT_SECRET=your_super_secret_jwt_key
   PORT=3000
   ADMIN_COLLEGE_ID=admin
   ADMIN_PASSWORD=admin123
   ```

4. **Start MongoDB**:
   Make sure MongoDB is running on your system

5. **Run the server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/register` - Register new student
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Meals
- `GET /api/meals/today` - Get today's available meals (public)
- `GET /api/meals` - Get all meals (admin only)
- `POST /api/meals` - Create new meal (admin only)
- `PUT /api/meals/:id` - Update meal (admin only)
- `DELETE /api/meals/:id` - Delete meal (admin only)

### Orders
- `POST /api/order` - Place new order (students only)
- `GET /api/orders/my` - Get user's orders (students only)
- `GET /api/orders/all` - Get all orders (admin only)
- `GET /api/orders/today` - Get today's orders (admin only)
- `GET /api/orders/dues` - Get pending dues (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `PUT /api/orders/:id/payment` - Update payment status (admin only)
- `DELETE /api/orders/:id` - Cancel order

## Database Schema

### User Model
```javascript
{
  collegeId: String (unique, required),
  password: String (hashed, required),
  phone: String (required for students),
  role: String (student/admin),
  isActive: Boolean,
  totalDue: Number,
  lastLogin: Date
}
```

### Meal Model
```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  quantity: Number (required),
  originalQuantity: Number,
  category: String (meal/snack/beverage),
  isAvailable: Boolean,
  date: Date,
  createdBy: ObjectId (User)
}
```

### Order Model
```javascript
{
  userId: ObjectId (User),
  studentId: String,
  mealId: ObjectId (Meal),
  mealName: String,
  price: Number,
  quantity: Number,
  status: String (pending/confirmed/completed/cancelled),
  paymentStatus: String (pending/paid/failed),
  orderDate: Date,
  completedAt: Date,
  notes: String
}
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Configurable cross-origin requests
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without sensitive data

## Default Admin Account

The system automatically creates an admin account on first run:
- **College ID**: `ADMIN` (or from env variable)
- **Password**: `admin123` (or from env variable)

## Development

### Project Structure
```
server/
├── models/          # Database models
├── routes/          # API route handlers
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── .env            # Environment variables
├── server.js       # Main server file
└── package.json    # Dependencies
```

### Running Tests
```bash
npm test
```

### Database Seeding
The server automatically creates an admin user on startup if none exists.

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a secure `JWT_SECRET`
3. Configure MongoDB connection string
4. Set up proper CORS origins
5. Use process manager like PM2
6. Set up reverse proxy (nginx)
7. Enable SSL/TLS

## API Response Format

All API responses follow this structure:
```javascript
{
  success: boolean,
  message: string,
  data: object | array,
  error: string (only on errors),
  pagination: object (for paginated responses)
}
```

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication failures
- Database errors
- Rate limiting
- Server errors

## Contributing

1. Follow the existing code structure
2. Add proper validation for new endpoints
3. Include error handling
4. Update documentation
5. Test thoroughly before submitting

## License

MIT License - see LICENSE file for details