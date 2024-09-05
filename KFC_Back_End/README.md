# KFC Order Management System

This project is a simple backend system for managing users, menus, and orders for a KFC restaurant. The system provides user authentication, role-based access control, menu management, and order management.

## Features

- User Sign Up, Login, and Logout.
- Role-based access control (Admin and Viewer).
- Menu Management (Add, Edit, Delete, View Menu Items).
- Order Management (Place, Edit, Delete Orders).
- Authentication using JWT and Bcrypt for password hashing.
- Integration with Cloudinary for storing menu item images.
- Secure user operations with middleware for authentication and authorization.
- Token blacklisting to prevent reuse of tokens after logout.

## Models

### User Model
```js
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    pass: { type: String, required: true },
    role: {
        type: String,
        required: true,
        default: "viewer",
        enum: ["admin", "viewer"]
    }
}, { versionKey: false });
```

### Menu Model
```js
const menuItemSchema = mongoose.Schema({
    name: { type: String, required: true },
    descriptions: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
}, { versionKey: false });
```

### Order Model
```js
const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    items: [{
        menuItems: { type: mongoose.Schema.Types.ObjectId, ref: "menu", required: true },
        quantity: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true }
}, { versionKey: false });
```

## API Routes

### User Routes

- POST /user/signIn: Create a new user.
- POST /user/login: User login with phone number and password.
- GET /user/logout: Logout user and blacklist token.
- PATCH /user/edit/:id: Edit user details (authenticated).
- DELETE /user/delete/:id: Delete user (authenticated).

### Menu Routes

- POST /menu/addItem: Add a menu item (admin role).
- GET /menu/allItem: Get all menu items.
- PATCH /menu/editItems/:id: Edit menu item (admin role).
- DELETE /menu/deleteItems/:id: Delete menu item (admin role).
- GET /menu/searchItems: Search menu items by query.

### Order Routes

- POST /orders/addOrders: Place an order (authenticated).
- GET /orders/myOders: Get user's orders (authenticated).
- GET /orders/allOders: Get all orders.
- PATCH /orders/editOders/:id: Edit an order.
- DELETE /orders/deleteOders/:id: Delete an order.

## Middleware

### Authentication

- auth: Middleware to verify JWT tokens and ensure users are authenticated.
- userAuth: Middleware to validate the phone number during user signup.
- permissionAuth: Role-based access control middleware to ensure only authorized roles can access specific routes.

## Installation

 #### Clone the repository:

- git clone  https://github.com/Ritesh-kumar-jena/KFC.git

- Install dependencies:

- npm install
- Create a .env file in the root directory with the following environment variables:
- makefile

- port=your_port_number
- key=your_jwt_secret_key
- database=your_mongoDB_connection_string
- cloudName=your_cloudinary_name
- APIKEY=your_cloudinary_api_key
- APISecret=your_cloudinary_api_secret
- Run the server:

- npm run dev 
- The server will run on the port specified in the .env file.

## Dependencies
- express
- mongoose
- bcrypt
- jsonwebtoken
- multer
- cloudinary
- dotenv
- cors

## Author : Ritesh Kumar Jena - Full Stack Developer


- This `README.md` provides an overview of the project, its models, routes, and installation instructions.