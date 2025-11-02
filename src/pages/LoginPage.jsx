import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import logoImage from '../assets/logo.svg'; 
import ErrorMessage from '../components/common/ErrorMessage'; // 👈 استيراد مكون الخطأ
import { SuccessMessage } from '../components/common/SuccessMessage'; // 👈 استيراد رسالة النجاح (لعرض رسالة التسجيل الناجح)


const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 لاستقبال رسالة النجاح من صفحة التسجيل
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  // مسح رسالة النجاح بعد فترة
  useState(() => {
    if (successMessage) {
        setTimeout(() => {
            setSuccessMessage('');
            // مسح حالة الموقع لتجنب ظهور الرسالة عند العودة للصفحة
            navigate(location.pathname, { replace: true, state: {} }); 
        }, 5000); 
    }
  }, [successMessage, location.pathname, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          
          {/* ✅ إدراج الشعار SVG */}
          <img 
             src={logoImage} 
             alt="InventoryHub Logo" 
             className="mx-auto h-16 w-auto mb-6" 
          />
          
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Login to continue to InventoryHub</p>
        </div>

        <div className="card">
          {/* 👇 عرض رسالة النجاح (القادمة من صفحة التسجيل) */}
          {successMessage && (
            <div className='mb-6'>
                <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
            </div>
          )}
          
          {/* 👇 استخدام ErrorMessage لعرض أخطاء تسجيل الدخول */}
          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="input pl-10"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="input pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg font-semibold"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs text-blue-700">User: demo / password: demo123</p>
          <p className="text-xs text-blue-700">Admin: admin / password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;