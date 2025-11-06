# Inventory Management System - Frontend

## 📝 Project Description
A modern, feature-rich React application for managing inventory, processing orders, and handling payments. This responsive web application provides an intuitive shopping experience for customers and powerful administrative tools for business management, including integrated Stripe payments and automated email notifications.

## 🚀 Tech Stack
- **React** 18
- **Vite** (Build tool)
- **React Router DOM** v6
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Context API** for state management
- **Stripe React** for payment processing
- **React Hook Form** for form management
- **React Hot Toast** for notifications
- **Docker**

## 🔗 Links
- **Backend Repository**: [https://github.com/YuTaX9/Order-and-Inventory-Management-System-backend]
- **Live Demo**: [Deploy ]
- **API Documentation**: [https://github.com/YuTaX9/Order-and-Inventory-Management-System-backend/blob/main/README.md]

## ✨ Features

### For Customers:
- 🔐 **User Authentication**
  - Register with email verification(link in the web)
  - Login with JWT
  - Password reset via email
  - Profile management

- 📦 **Product Browsing**
  - Advanced filtering (category, price, stock)
  - Real-time search
  - Sort options
  - Product details with images
  - Stock availability indicators

- 🛒 **Shopping Experience**
  - Interactive shopping cart
  - Quantity management
  - Real-time total calculation
  - Cart persistence (localStorage)
  - Stock validation

- 💳 **Checkout & Payment**
  - Secure checkout process
  - **Stripe payment integration**
  - **Shipping cost calculation**
  - Multiple shipping methods
  - Order summary
  - Payment confirmation

- 📋 **Order Management**
  - Order history
  - Real-time order status tracking
  - Order details view
  - Cancel orders (pending only)

### For Admins:
- 📊 **Dashboard Analytics**
  - Total sales and revenue
  - Orders by status
  - Low stock alerts
  - Recent orders overview
  - Revenue trends

- 🎯 **Product Management**
  - Create/Edit/Delete products
  - Bulk operations
  - Image management
  - SKU tracking
  - Category assignment

- 🚚 **Order Management**
  - View all orders
  - Update order status
  - Filter by status
  - **Process refunds**
  - Shipping management


## 📁 Project Structure
src/
├── assets/
│   ├── logo.svg
│   ├── hero-pattern.svg
├── components/
│   ├── admin/
│   │   ├── AdminStats.jsx
│   ├── auth/
│   │   ├── AdminRoute.jsx
│   │   └── ProtectedRoute.jsx
│   ├── cart/
│   │   ├── CartItem.jsx
│   │   └── CartSummary.jsx
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Loading.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── SuccessMessage.jsx
│   │   └── ConfirmModal.jsx
│   ├── orders/
│   │   ├── OrderCard.jsx
│   │   └── CheckoutForm.jsx
│   └── products/
│       ├── ProductCard.jsx
│       ├── ProductList.jsx
│       ├── ProductForm.jsx
│       └── ProductFilters.jsx
├── context/
│   ├── AuthContext.jsx           # Authentication state
│   └── CartContext.jsx            # Shopping cart state
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminShippingZonesPage.jsx
│   │   ├── ManageProductsPage.jsx
│   │   ├── CreateProductPage.jsx
│   │   ├── EditProductPage.jsx
│   │   ├── ManageOrdersPage.jsx
│   │   └── ManageCategoriesPage.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── PasswordResetPage.jsx     # New: Password reset
│   ├── MyOrdersPage.jsx
│   ├── OrderDetailPage.jsx
│   ├── ProductDetailPage.jsx
│   ├── ProductsPage.jsx
│   ├── ProfilePage.jsx
│   └── PaymentPage.jsx    # New: Payment confirmation
├── services/
│   ├── api.js                     # Axios configuration
│   ├── adminService.js
│   ├── authService.js
│   ├── categoryService.js
│   ├── orderService.js
│   ├── productService.js
│   └── shippingService.js         # New: Shipping calculations
├── utils/
├── App.jsx
└── main.jsx

## 🔧 Installation Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running (see backend repo)
- Stripe account (for payment features)

### Local Setup (Without Docker)

1. **Clone the repository**
```bash
git clone 
cd inventory-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create `.env` file in project root:
```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# App Configuration
VITE_APP_NAME=Inventory System
VITE_APP_URL=http://localhost:5173

# Features Flags (optional)
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_SHIPPING_CALC=true
VITE_ENABLE_EMAIL_NOTIFICATIONS=true
```

4. **Run development server**
```bash
npm run dev
```

Application will be available at: `http://localhost:5173/`

5. **Build for production**
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Docker Setup
```bash
FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
```

4. **Access the application:**
- Frontend: `http://localhost:5173/`

### Environment Variables Explanation

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key | Yes (for payments) |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_URL` | Frontend URL | No |
| `VITE_ENABLE_PAYMENTS` | Enable Stripe payments | No (default: true) |
| `VITE_ENABLE_SHIPPING_CALC` | Enable shipping calculation | No (default: true) |

## 🛣️ Routes

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Landing page with featured products |
| `/login` | LoginPage | User login |
| `/register` | RegisterPage | User registration |
| `/password-reset` | PasswordResetPage | Request password reset |
| `/password-reset-confirm/:token` | PasswordResetConfirmPage | Confirm password reset |
| `/products` | ProductsPage | Browse all products |
| `/products/:id` | ProductDetailPage | View product details |

### Protected Routes (Require Login)
| Route | Component | Description |
|-------|-----------|-------------|
| `/cart` | CartPage | Shopping cart |
| `/checkout` | CheckoutPage | Order checkout with payment |
| `/payment/` | PaymentPage | Payment confirmation |
| `/orders` | MyOrdersPage | User's order history |
| `/orders/:id` | OrderDetailPage | Single order details |
| `/profile` | ProfilePage | User profile management |

### Admin Routes (Require Admin Role)
| Route | Component | Description |
|-------|-----------|-------------|
| `/admin/dashboard` | AdminDashboard | Admin overview & analytics |
| `/admin/products` | ManageProductsPage | Manage all products |
| `/admin/products/new` | CreateProductPage | Create new product |
| `/admin/products/:id/edit` | EditProductPage | Edit product |
| `/admin/orders` | ManageOrdersPage | Manage all orders |
| `/admin/payments` | PaymentsPage | Payment history & refunds |

### Protected Routes

#### **ProtectedRoute**
Wraps routes that require authentication. Redirects to login if not authenticated.

#### **AdminRoute**
Wraps routes that require admin privileges. Shows access denied if not admin.

### Reusable Components

- **Loading**: Animated loading spinner
- **ErrorMessage**: Styled error display
- **SuccessMessage**: Success notification with auto-dismiss
- **ConfirmModal**: Confirmation dialog for destructive actions
- **Toast**: Non-blocking notifications (react-hot-toast)

## 🎨 Styling & Theme

### Tailwind CSS Configuration

**Color Palette:**
```javascript
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',  // Main blue
    600: '#2563eb',
    700: '#1d4ed8',
  },
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
}
```

**Status Colors:**
- **Pending**: Yellow (#F59E0B)
- **Paid**: Green (#10B981)
- **Processing**: Blue (#3B82F6)
- **Shipped**: Purple (#8B5CF6)
- **Delivered**: Green (#10B981)
- **Cancelled**: Red (#EF4444)

### Responsive Breakpoints
```javascript
screens: {
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

### Payment Features
- ✅ Secure card input with Stripe Elements
- ✅ Real-time validation
- ✅ 3D Secure (SCA) support
- ✅ Payment intent API
- ✅ Webhook handling (backend)
- ✅ Payment status tracking
- ✅ Refund processing (admin)
- ✅ Payment history

## 📦 Dependencies

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^3.3.5",
  "@headlessui/react": "^1.7.17",
  "react-hot-toast": "^2.4.1",
  "react-icons": "^4.12.0"
}
```

### Payment & Forms
```json
{
  "@stripe/stripe-js": "^2.2.0",
  "@stripe/react-stripe-js": "^2.4.0",
  "react-hook-form": "^7.48.2"
}
```

### Development
```json
{
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.2.0",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32"
}
```

### Useful Resources
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Vite Guide](https://vitejs.dev/guide)

## 👨‍💻 Development Team

**Lead Developer**: Bassam Alghamdi
- GitHub: [ @YuTaX9 ](https://github.com/YuTaX9)
- LinkedIn: [ BASSAM ALGHAMDI ](www.linkedin.com/in/bassam-alghamdi-42594028a)
- Email: bassam.ghk@gmail.com

## 🙏 Acknowledgments

- **Bootcamp**: SDA x GA Software Engineering [ Remote ]
- **Instructors**: George Jones, Conor Hamilton, Asti Shalymova
- **Stripe**: For excellent payment API documentation
- **Tailwind CSS**: For the amazing utility-first CSS framework
- **React Community**: For incredible tools and libraries

## 📄 License

This project is part of an educational program and is for portfolio purposes only.