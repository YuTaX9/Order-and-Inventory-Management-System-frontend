import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import CreateProductPage from './pages/admin/CreateProductPage';
import EditProductPage from './pages/admin/EditProductPage';
import ManageOrdersPage from './pages/admin/ManageOrdersPage';
import AdminShippingZonesPage from './pages/admin/AdminShippingZonesPage'; 
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ManageCategoriesPage from './pages/admin/ManageCategoriesPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
          <Route path="/checkout" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } />
            <Route path="/payment" element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
            } />
          <Route path="/orders" element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            } />
          <Route path="/orders/:id" element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
            } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <ManageProductsPage />
            </AdminRoute>
            } />
          <Route path="/admin/products/new" element={
            <AdminRoute>
              <CreateProductPage />
            </AdminRoute>
            } />
          <Route path="/admin/products/:id/edit" element={
            <AdminRoute>
              <EditProductPage />
            </AdminRoute>
            } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <ManageOrdersPage />
            </AdminRoute>
            } />
          <Route path="/admin/categories" element={
            <AdminRoute>
              <ManageCategoriesPage />
            </AdminRoute>
            } />
          <Route path="/admin/shipping-zones" element={
            <AdminRoute>
              <AdminShippingZonesPage />
            </AdminRoute>
            } />
        </Routes>
        <Footer/>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;