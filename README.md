# 🍔 QuickFood – On-Demand Food Delivery Platform

[![React](https://img.shields.io/badge/React-16.8.6-61dafb.svg?style=flat&logo=react)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-4.0.1-764abc.svg?style=flat&logo=redux)](https://redux.js.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-ffca28.svg?style=flat&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

**QuickFood** is a full-featured, modern food ordering and delivery web application built with **React**, **Redux**, and **Firebase Cloud Firestore**. It delivers a seamless, production-ready experience for both customers ordering food and restaurant owners managing orders and dishes in real-time.

---

## 📸 Key Features & Capabilities

### 👤 Customer Experience
* **Dynamic Restaurant Discovery**: Browse partner kitchens with live search, category checklists (Burgers, Pizza, BBQ, Asian, etc.), and multi-option sorting (Ratings, Best Match, Alphabetical).
* **Interactive Menu & Food Catalog**: Detailed dish cards featuring ingredients, dietary categories, pricing, and high-resolution imagery.
* **Smart Shopping Cart & Basket**:
  - Add, adjust quantities, and remove items with instant total calculations.
  - Dynamic delivery fee waivers (Free shipping on orders over RS. 1000).
  - Promo voucher discount engine (`QUICKFOOD20` for 20% off subtotal, `FREESHIP` for free delivery).
* **Live Visual Order Tracking Stepper**:
  - 4-stage delivery timeline (*Order Placed $\rightarrow$ Kitchen Preparing $\rightarrow$ Out for Delivery $\rightarrow$ Delivered*).
  - Categorized order history tabs (*All*, *Active & In Progress*, *Completed Deliveries*).
  - One-click "Order Again" re-ordering functionality.

### 🏪 Restaurant Merchant Dashboard
* **Real-time Order Processing Queue**:
  - Live metric cards tracking *Pending Orders*, *In Kitchen*, *Delivered*, and *Total Sales Revenue (RS)*.
  - Interactive dispatch status actions (*Accept & Start Preparing*, *Mark as Delivered*).
* **Dish & Menu Management**:
  - Add new signature food items with photo uploads, ingredient descriptions, custom pricing, and category pills.
  - Manage live inventory on the *My Foods* portal.

### 🎨 Modern Design & UX System
* **Modern UI**: Tailored Crimson-Slate color palette, glassmorphism sticky navigation, card elevations, soft borders, and mobile responsive menus.
* **Robust Error Handling**: Toast notifications and alert dialogs via SweetAlert2, comprehensive input validation, and defensive guards.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React.js (v16.8.6) with React Router DOM v5 |
| **State Management** | Redux + Redux Thunk (Asynchronous middleware) |
| **Backend & Database** | Firebase Cloud Firestore (NoSQL Document Store) |
| **Authentication & Storage** | Firebase Authentication & Firebase Storage |
| **Styling & Icons** | Custom CSS Design Tokens, Bootstrap 4, FontAwesome 5 |
| **Alerts & Modals** | SweetAlert2 |

---

## 📂 Project Architecture

```
food-delivery-app/
├── public/
│   ├── favicon.ico
│   ├── index.html            # HTML5 template with Inter & Outfit typography
│   └── manifest.json
├── src/
│   ├── assets/               # Image assets, restaurant logos, and illustrations
│   ├── components/
│   │   ├── Navbar2.js        # Modern glassmorphism sticky navbar with role detection
│   │   ├── Footer.js         # 4-column modern responsive footer
│   │   └── Navbar.js         # Delegating router wrapper
│   ├── config/
│   │   └── firebase.js       # Firebase initialization, Auth, Firestore & Storage APIs
│   ├── screens/
│   │   ├── Home.js           # Hero landing, live search, metrics, and feature highlights
│   │   ├── Restaurants.js    # Filterable & sortable restaurant directory
│   │   ├── RestaurantDetails.js # Menu browsing, customer reviews, & interactive cart
│   │   ├── MyOrders.js       # Visual 4-step order delivery tracking stepper
│   │   ├── OrderRequests.js  # Restaurant owner order queue & sales dashboard
│   │   ├── AddMenuItems.js   # New dish creation form with live preview
│   │   ├── MyFoods.js        # Restaurant dish inventory
│   │   ├── Login.js          # Customer authentication (Sign In / Register)
│   │   └── RegisterRestaurant.js # Restaurant merchant registration portal
│   ├── store/
│   │   ├── action/           # Redux action creators (Auth, Orders, Menus)
│   │   └── reducer/          # Root Reducer & state slices
│   ├── App.css               # Global CSS design tokens, steppers, and card styles
│   ├── App.js                # Root routing & Redux Provider configuration
│   └── index.js              # Application entry point
├── package.json
└── README.md
```

---

## 🚀 Getting Started & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v14, v16, v18, v20, or v22+)
- [npm](https://www.npmjs.com/)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/food-delivery-app.git
cd food-delivery-app
npm install --legacy-peer-deps
```

### 2. Configure Firebase (Optional)
The project includes pre-configured Firebase Firestore credentials in [`src/config/firebase.js`](src/config/firebase.js). If you want to use your own Firebase project:
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Email/Password Authentication**, **Firestore Database**, and **Storage**.
3. Replace the `firebaseConfig` object in `src/config/firebase.js` with your credentials.

### 3. Run Locally

#### **For Windows PowerShell / Node 17+:**
```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm start
```

#### **For macOS / Linux:**
```bash
NODE_OPTIONS="--openssl-legacy-provider" npm start
```

#### **Or use the included script shortcut:**
```bash
npm run start:legacy
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎟️ Demo Promo Codes

Test the interactive checkout discount engine on any order basket:
- **`QUICKFOOD20`** – Applies **20% OFF** subtotal discount.
- **`FREESHIP`** – Applies **FREE Delivery** on any order size.

---

## 🔒 Test Credentials

You can sign up directly through the UI or test with:
- **Customer Account**: Register via [Sign In / Register](http://localhost:3000/#/login)
- **Restaurant Merchant Account**: Register via [Restaurant Portal](http://localhost:3000/#/register-restaurant)

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
