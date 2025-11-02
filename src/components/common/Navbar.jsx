import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:block">
              InventoryHub
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Products
            </Link>
            
            {user ? (
              <>
                <Link to="/orders" className="text-gray-700 hover:text-primary-600 transition font-medium">
                  My Orders
                </Link>

                <Link to="/cart" className="relative">
                  <div className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </Link>

                {user.is_staff && (
                  <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary-600 transition font-medium">
                    Admin
                  </Link>
                )}
                
                <div className="flex items-center space-x-3">
                  <div className="hidden lg:block text-sm">
                    <p className="font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.is_staff ? 'Admin' : 'Customer'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="px-4 py-2 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" className="px-4 py-2 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Products
              </Link>
              
              {user ? (
                <>
                  <Link to="/orders" className="px-4 py-2 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    My Orders
                  </Link>
                  <Link to="/cart" className="px-4 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between" onClick={() => setMobileMenuOpen(false)}>
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="badge badge-danger">{cartCount}</span>
                    )}
                  </Link>
                  {user.is_staff && (
                    <Link to="/admin/dashboard" className="px-4 py-2 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="px-4 py-2">
                    <p className="font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link to="/profile" className="nav-px-4 py-2 hover:bg-gray-50 rounded-lg">
                    My Profile
                  </Link>
                  <button onClick={handleLogout} className="mx-4 btn btn-danger">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="mx-4 btn btn-outline" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="mx-4 btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;