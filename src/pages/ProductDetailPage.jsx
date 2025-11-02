import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Loading from '../components/common/Loading';
// 👇 استيراد مكونات الرسائل
import { SuccessMessage } from '../components/common/SuccessMessage';
import ErrorMessage from '../components/common/ErrorMessage';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart, isInCart, getItemQuantity } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setError(''); // مسح الأخطاء عند التحميل
    try {
      const data = await getProduct(id);
      setProduct(data);
    } catch (err) {
      setError('Product not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    addToCart(product, quantity);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (loading) return <Loading />;

  // 🚨 استخدام ErrorMessage لعرض خطأ عدم العثور على المنتج
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <ErrorMessage message={error || "Product details are unavailable."} />
          <div className="mt-4">
              <Link to="/products" className="btn btn-primary">
                ← Back to Products
              </Link>
            </div>
        </div>
      </div>
    );
  }

  const itemInCart = isInCart(product.id);
  const currentCartQuantity = getItemQuantity(product.id);
  const maxQuantity = product.stock_quantity - currentCartQuantity;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <nav className="mb-6 flex items-center space-x-2 text-sm">
          <Link to="/" className="text-gray-500 hover:text-primary-600">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/products" className="text-gray-500 hover:text-primary-600">Products</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        {/* 🚨 استخدام SuccessMessage Component */}
        {showSuccess && (
          <div className="mb-6">
            <SuccessMessage 
                message={`Added ${quantity} x ${product.name} to cart!`} 
                onClose={() => setShowSuccess(false)} 
            />
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <div className="card mb-6">
              {product.category_name && (
                <span className="badge badge-info mb-4">
                  {product.category_name}
                </span>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="mb-6">
                <span className="text-4xl font-bold text-primary-600">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>SKU: {product.sku}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Seller: {product.user_username}</span>
                </div>
              </div>

              <div className="mb-6 p-4 rounded-lg bg-gray-50">
                {product.is_in_stock ? (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-600 font-semibold">In Stock</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {product.stock_quantity} units available
                    </p>
                    {product.is_low_stock && (
                      <p className="text-sm text-orange-600 mt-1">⚠️ Low stock - Order soon!</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {product.is_in_stock && (
                <div className="space-y-4">
                  {itemInCart && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        ✓ {currentCartQuantity} in cart
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-3 hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
                          className="w-16 text-center border-x border-gray-300 py-3"
                          min="1"
                          max={maxQuantity}
                        />
                        <button
                          onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                          className="px-4 py-3 hover:bg-gray-100"
                          disabled={quantity >= maxQuantity}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2 opacity-0">
                        Action
                      </label>
                      <button
                        onClick={handleAddToCart}
                        disabled={maxQuantity === 0}
                        className="w-full btn btn-primary py-3 text-lg font-semibold"
                      >
                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {itemInCart ? 'Add More to Cart' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {user && (user.id === product.user || user.is_staff) && (
              <div className="card bg-yellow-50 border-yellow-200">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-800 mb-2">Product Owner</p>
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="btn btn-outline text-sm"
                    >
                      Edit Product
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;