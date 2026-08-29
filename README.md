# QuickFood - Food Delivery Web App

A food ordering and delivery web application built with React, Redux, and Firebase. This application allows customers to browse local restaurants, add food items to a shopping cart, apply promo discounts, and track order statuses in real time. It also provides a restaurant dashboard for managing incoming orders and menu items.

## Features

### Customer
- **Restaurant Search & Filter**: Search restaurants by name or filter by cuisine categories (Burgers, Pizza, BBQ, Fast Food, etc.) and sort by ratings or name.
- **Menu & Cart**: View restaurant dishes with ingredients and pricing. Add items to the cart, adjust quantities, and apply discount vouchers.
- **Order Tracking**: Visual step-by-step progress tracking for placed orders (`Order Placed` -> `Kitchen Preparing` -> `Out for Delivery` -> `Delivered`).
- **User Accounts**: Customer registration and login with profile management.

### Restaurant Manager
- **Incoming Orders Dashboard**: View order requests, monitor order statuses, and update status from pending to in-progress and delivered.
- **Sales & Order Metrics**: Live count of pending, preparing, and completed orders with revenue summaries.
- **Menu Management**: Add new dishes with photos, pricing, ingredients, and categories.

## Tech Stack

- **Frontend**: React 16, React Router DOM, Bootstrap 4, FontAwesome
- **State Management**: Redux, Redux Thunk
- **Backend & Database**: Firebase Authentication, Cloud Firestore, Firebase Storage
- **UI Alerts**: SweetAlert2

## Project Structure

```text
food-delivery-app/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/               # Static images and icons
│   ├── components/           # Navbar and Footer components
│   ├── config/               # Firebase setup and service helpers
│   ├── screens/              # Main route views (Home, Restaurants, Details, Orders, Login)
│   ├── store/                # Redux actions and reducers
│   ├── App.css               # Global application styles
│   ├── App.js                # Route definitions
│   └── index.js              # Entry point
├── package.json
└── README.md
```

## Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Siddeshgs/food-delivery-app.git
cd food-delivery-app
npm install --legacy-peer-deps
```

### 2. Running Locally

Start the React development server:

```bash
npm start
```

If you are using Node 17 or higher (Node 18/20/22+), run:

```bash
npm run start:legacy
```

or set the OpenSSL flag directly in your terminal:

**Windows (PowerShell):**
```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"; npm start
```

**macOS / Linux:**
```bash
NODE_OPTIONS="--openssl-legacy-provider" npm start
```

The application will be accessible at `http://localhost:3000`.

## Promo Codes

The following discount codes can be applied during checkout:
- `QUICKFOOD20` - 20% discount on order subtotal
- `FREESHIP` - Free delivery

## License

This project is licensed under the MIT License.

