import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    loadProduct();
  }, [id]);
  
  const loadProduct = async () => {
    try {
      const data = await getProduct(id);
      setProduct(data);
    } catch (err) {
      setError('Product not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = () => {
    // Cart Context
    alert(`Added ${quantity} ${product.name} to cart!`);
  };
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Product not found" />;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/products')}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Products
      </button>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img 
            src={product.image_url || 'https://via.placeholder.com/500'} 
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          {product.category_name && (
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded mb-4">
              {product.category_name}
            </span>
          )}
          
          <p className="text-4xl font-bold text-blue-600 mb-4">${product.price}</p>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">SKU: {product.sku}</p>
            <p className="text-sm text-gray-600">Seller: {product.user_username}</p>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded">
            {product.is_in_stock ? (
              <>
                <p className="text-green-600 font-semibold">✓ In Stock</p>
                <p className="text-sm text-gray-600">{product.stock_quantity} units available</p>
                {product.is_low_stock && (
                  <p className="text-orange-500 text-sm mt-1">⚠ Only a few left!</p>
                )}
              </>
            ) : (
              <p className="text-red-600 font-semibold">✗ Out of Stock</p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {product.is_in_stock && (
            <div className="flex gap-4 items-center">
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock_quantity, parseInt(e.target.value) || 1)))}
                  className="w-20 p-2 border rounded"
                />
              </div>
              
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Add to Cart
              </button>
            </div>
          )}

          {user && (user.id === product.user || user.is_staff) && (
            <div className="mt-6 p-4 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-sm font-semibold mb-2">Owner Actions</p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Edit Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;