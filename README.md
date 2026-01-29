# 💰 Income Expense Tracker API

A robust Node.js REST API for managing income and expense transactions with user authentication, category management, and comprehensive dashboard analytics.

## 🚀 Features

- **User Authentication** - JWT-based authentication with refresh tokens
- **Category Management** - Income/Expense categories with default categories
- **Transaction Management** - Full CRUD operations for transactions
- **Dashboard Analytics** - Total income, expense, and balance calculations
- **Advanced Filtering** - Filter by date range, category, type, search, and pagination
- **Clean Architecture** - Modular structure following Domain-Driven Design principles
- **Security** - Rate limiting, input validation, and error handling

## 📋 Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 5.x
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Joi
- **Security:** Helmet, CORS, express-rate-limit
- **Logging:** Winston

## 📁 Project Structure

```
src/
├── config/                 # Configuration files
├── infrastructure/         # Database, logger setup
│   ├── database/
│   └── logger/
├── interfaces/            # API layer (routes, controllers, middlewares)
│   ├── middlewares/
│   └── routes/
├── modules/               # Feature modules (Clean Architecture)
│   ├── auth/             # Authentication module
│   │   ├── domain/       # Entities & Repository interfaces
│   │   ├── infrastructure/ # Database models & implementations
│   │   ├── application/  # Use cases
│   │   └── interfaces/   # Controllers, routes, validators
│   ├── category/         # Category management module
│   └── transaction/      # Transaction management module
├── services/             # External services (storage, etc.)
├── utils/                # Utility functions
└── server.js             # Application entry point
```

## 🏗️ Architecture

Each module follows **Clean Architecture** pattern:

- **Domain Layer** - Business entities and repository interfaces
- **Infrastructure Layer** - Database models and repository implementations
- **Application Layer** - Use cases (business logic)
- **Interface Layer** - Controllers, routes, and validators

## 🔐 Authentication

All protected routes require JWT token in Authorization header:

```
Authorization: Bearer <access_token>
```

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/logout` | Logout (invalidate token) |
| POST | `/api/v1/auth/refresh-token` | Refresh access token |
| POST | `/api/v1/auth/change-password` | Change password |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password with token |
| GET | `/api/v1/auth/me` | Get current user profile |
| PUT | `/api/v1/auth/me` | Update user profile |

## 📂 Category API

Manage income and expense categories. Default categories are protected from modification/deletion.

### Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/categories` | Create category | ✅ |
| GET | `/api/v1/categories` | Get all categories | ✅ |
| GET | `/api/v1/categories/type/:type` | Get by type (income/expense) | ✅ |
| GET | `/api/v1/categories/:id` | Get category by ID | ✅ |
| PUT | `/api/v1/categories/:id` | Update category | ✅ |
| DELETE | `/api/v1/categories/:id` | Delete category | ✅ |

### Query Parameters (GET)

- `type` - Filter by type: `income` or `expense`
- `search` - Search by category name
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sort` - Sort field: `createdAt`, `name`, `type`
- `order` - Sort order: `asc` or `desc`

### Example Request

```bash
POST /api/v1/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Food & Dining",
  "type": "expense"
}
```

## 💳 Transaction API

Manage income and expense transactions with advanced filtering.

### Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/transactions` | Create transaction | ✅ |
| GET | `/api/v1/transactions` | Get all transactions | ✅ |
| GET | `/api/v1/transactions/:id` | Get transaction by ID | ✅ |
| PUT | `/api/v1/transactions/:id` | Update transaction | ✅ |
| DELETE | `/api/v1/transactions/:id` | Delete transaction | ✅ |

### Query Parameters (GET)

- `search` - Search in notes/description
- `categoryId` - Filter by category ID
- `type` - Filter by type: `income` or `expense`
- `userId` - Filter by user ID (admin only)
- `startDate` - Start date (ISO format: YYYY-MM-DD)
- `endDate` - End date (ISO format: YYYY-MM-DD)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sort` - Sort field: `date`, `amount`, `createdAt`, `updatedAt`
- `order` - Sort order: `asc` or `desc`

### Example Request

```bash
POST /api/v1/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "expense",
  "categoryId": "507f1f77bcf86cd799439011",
  "amount": 1500.50,
  "date": "2026-01-26",
  "notes": "Grocery shopping"
}
```

## 📊 Dashboard API

Get financial summary: total income, total expense, and balance.

### Endpoint

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/dashboard` | Get dashboard stats | ✅ |

### Query Parameters

- `startDate` - Start date for date range (ISO format: YYYY-MM-DD)
- `endDate` - End date for date range (ISO format: YYYY-MM-DD)

**Note:** User ID is automatically extracted from JWT token. No need to pass `userId` in request.

### Example Request

```bash
# All time stats
GET /api/v1/dashboard
Authorization: Bearer <token>

# Date range stats
GET /api/v1/dashboard?startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalIncome": 50000,
    "totalExpense": 25000,
    "balance": 25000,
    "startDate": "2026-01-01",
    "endDate": "2026-01-31"
  }
}
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd income-expenes-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Server
   PORT=3000
   NODE_ENV=development
   APP_NAME=Income Expense Tracker

   # Database
   MONGODB_URI=mongodb://localhost:27017/income-expense-tracker

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_REFRESH_SECRET=your-refresh-secret-key
   JWT_ACCESS_EXPIRES_IN=60m
   JWT_REFRESH_EXPIRES_IN=7d

   # CORS
   CORS_ORIGIN=*

   # Logging
   LOG_LEVEL=info

   # Storage
   UPLOAD_DIR=uploads

   # Optional: Auto-seed default categories
   SEED_CATEGORIES=true
   ```

4. **Seed Default Categories** (Optional)
   ```bash
   npm run seed:categories
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed:categories` - Seed default categories
- `npm run seed:categories:clear` - Clear default categories
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password encryption
- **Rate Limiting** - Protection against brute force attacks
- **Input Validation** - Joi schema validation for all inputs
- **CORS** - Configurable cross-origin resource sharing
- **Helmet** - Security headers
- **Error Handling** - Centralized error handling middleware

## 📦 Default Categories

The system includes predefined categories that cannot be modified or deleted:

**Income:** Salary, Freelance, Business, Investment, Rental Income, Bonus, Gift, Other Income

**Expense:** Food & Dining, Transportation, Shopping, Bills & Utilities, Entertainment, Healthcare, Education, Travel, Personal Care, Home & Garden, Insurance, Taxes, Other Expense

## 📄 API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "timestamp": "2026-01-26T10:00:00.000Z",
    "requestId": "uuid-here"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2026-01-26T10:00:00.000Z",
    "requestId": "uuid-here",
    "path": "/api/v1/endpoint"
  }
}
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Health Check

```bash
GET /api/health
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

ISC

## 👤 Author

Maulik Rajpara

---

**Built with ❤️ using Node.js and Express**
