# 🛒 NexCart E-Commerce Platform

NexCart is a high-performance, full-stack e-commerce engine built for the modern web. It enables businesses to manage their storefront, inventory, and analytics with uncompromising efficiency and design.

![NexCart Poster](file:///C:/Users/Lenovo/.gemini/antigravity/brain/6fb3bb59-c92e-4d0c-be7d-2dfdf1744b67/media__1775407462719.png)

---

## 🏗️ Architecture

NexCart is built on a distributed MERN stack, offering a scalable and robust infrastructure:

| Component | Responsibility | Technology |
| :--- | :--- | :--- |
| **Frontend** | Highly-performant, responsive UI | React, Vite, Redux Toolkit, Vanilla CSS |
| **Backend** | Scalable RESTful API | Node.js, Express, JWT, Mongoose |
| **Database** | Secure and flexible data storage | MongoDB |
| **Payments** | Real-time secure transactions | PayPal API |
| **Assets** | Cloud-based secure image storage | Cloudinary |

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- PayPal Client ID (optional, defaults to test mode)

### 2. Installation & Setup
Clone the repository and install dependencies for both the frontend and backend:

```bash
# Clone the repository
git clone https://github.com/pranavhasban2006/NexCart.git
cd NexCart

# Install Backend dependencies
cd backend && npm install

# Install Frontend dependencies
cd ../frontend && npm install
```

### 3. Environment Configuration
Create a `.env` file in the `backend` and `frontend` directories using the provided examples.

### 4. Seed the Database
Populate your database with the initial project data and admin user:
```bash
cd backend
node seeder.js
```

### 5. Launch the Platform
Start both the backend and frontend development servers:
- **Backend**: `npm run dev` (Runs on http://localhost:9000)
- **Frontend**: `npm run dev` (Runs on http://localhost:5173)

---

## 🛡️ Admin Access
The default admin account (after seeding) is:
- **Email**: `admin@example.com`
- **Password**: `password`

---

## ✨ Key Features
-   **Intelligent Cart**: Supports both guest and user sessions with automatic state merging.
-   **Professional Dashboard**: Full administrative control over products, orders, and users.
-   **Secured APIs**: Protected by JWT authentication and custom permission-based middleware.
-   **Rich UI/UX**: Designed for mobile-first responsiveness with smooth and intuitive navigation.
-   **Image Uploads**: Integrated Cloudinary support for high-quality production image hosting.

---

## ⚖️ License
This project is licensed under the MIT License.

## 💳 Test Payment Credentials
This app uses PayPal Sandbox (no real money). Use these to test checkout:

- **Email**: sb-fhjt550289551@personal.example.com
- **Password**: 8DI$#kqL
