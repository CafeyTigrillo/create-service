# 🔐 User Registration API

A robust and secure Registration API built with Express.js and Sequelize, featuring role-based access control and branch management capabilities.

## ✨ Features

- User Registration with role-based access control
- Secure password hashing using bcrypt
- Input validation and error handling
- Branch-specific user management
- PostgreSQL database integration with Sequelize ORM

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MySQL database


## 📝 API Documentation

### Register User
`POST /users/register`

Creates a new user with role-based permissions.

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "branch_manager",
  "branch_id": 1
}
```

#### Supported Roles
- `admin_central`: System administrator
- `branch_manager`: Branch location manager
- `branch_employee`: Branch staff member

#### Response
```json
{
  "message": "User created",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "branch_manager",
    "branch_id": 1
  }
}
```

## 🔒 Security Features

- Password hashing using bcrypt (10 rounds)
- Email uniqueness validation
- Role validation
- Branch association validation

## 📚 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  role ENUM('admin_central', 'branch_manager', 'branch_employee') NOT NULL,
  branch_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🛠️ Error Handling

The API includes comprehensive error handling for:
- Duplicate email addresses
- Invalid roles
- Missing branch IDs for branch-specific roles
- Server and database errors