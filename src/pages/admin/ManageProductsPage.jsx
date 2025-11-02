import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// 👇 استيراد الخدمات المطلوبة
import { getAllProducts, deleteProduct } from '../../services/productService'; 
// 👇 استيراد مكونات الرسائل والتأكيد
import Loading from '../../components/common/Loading';
import { SuccessMessage } from '../../components/common/SuccessMessage';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConfirmModal from '../../components/common/ConfirmModal'; 

const ManageProductsPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null); // 👈 حالة الخطأ
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  // 👇 حالة مودال التأكيد على الحذف
  const [confirmDelete, setConfirmDelete] = useState(null); 

  useEffect(() => {
    loadProducts();
    if (successMessage) {
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  }, []);

  const loadProducts = async () => {
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products list. Check your connection.'); // 👈 تعيين خطأ التحميل
    } finally {
      setLoading(false);
    }
  };

  // 👇 دالة تنفيذ الحذف بعد التأكيد
  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    
    const { id: productId, name: productName } = confirmDelete;
    setConfirmDelete(null); // إغلاق المودال
    setLoading(true);

    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      setSuccessMessage(`Product "${productName}" deleted successfully!`);
    } catch (err) {
      setError(err.response?.data?.error || `Failed to delete product "${productName}".`);
    } finally {
      setLoading(false);
      setTimeout(() => setError(null), 5000); 
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Manage <span className="text-gradient">Products</span>
            </h1>
            <p className="text-gray-600">Add, edit, and manage your product inventory</p>
          </div>
          <Link to="/admin/products/new" className="btn btn-secondary px-6 py-3 text-lg">
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Product
          </Link>
        </div>

        {/* 🚨 عرض رسائل النجاح والخطأ */}
        {error && <ErrorMessage message={error} />}

        {successMessage && (
          <div className="mb-6">
            <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
          </div>
        )}

        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="font-semibold">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">SKU</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">by {product.user_username}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {product.sku}
                    </td>

                    <td className="px-6 py-4">
                      {product.category_name ? (
                        <span className="badge badge-info">
                          {product.category_name}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${parseFloat(product.price).toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-bold ${
                          product.stock_quantity === 0 ? 'text-red-600' :
                          product.is_low_stock ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {product.stock_quantity}
                        </span>
                        {product.stock_quantity === 0 && (
                          <span className="badge badge-danger text-xs">
                            Out
                          </span>
                        )}
                        {product.is_low_stock && product.stock_quantity > 0 && (
                          <span className="badge badge-warning text-xs">
                            Low
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {product.is_active ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge bg-gray-200 text-gray-800">Inactive</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          Edit
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link
                          to={`/products/${product.id}`}
                          className="text-gray-600 hover:text-gray-700 font-medium text-sm"
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
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-600 font-semibold">No products found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProductsPage;