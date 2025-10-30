import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllProducts } from '../../services/productService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const ManageProductsPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  
  useEffect(() => {
    loadProducts();
    
    if (successMessage) {
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  }, []);
  
  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase())
  );
  
  if (loading) return <Loading />;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Add New Product
        </Link>
      </div>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✓ {successMessage}
        </div>
      )}
      
      {error && <ErrorMessage message={error} />}
      
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-3 border rounded-lg"
        />
      </div>
      
      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">SKU</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={product.image_url || 'https://via.placeholder.com/50'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{product.sku}</td>
                <td className="px-4 py-3 text-sm">{product.category_name || 'N/A'}</td>
                <td className="px-4 py-3 text-sm font-semibold">${product.price}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`font-semibold ${
                    product.stock_quantity === 0 ? 'text-red-600' :
                    product.is_low_stock ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {product.stock_quantity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {product.is_active ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/products/${product.id}`}
                      className="text-gray-600 hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProductsPage;