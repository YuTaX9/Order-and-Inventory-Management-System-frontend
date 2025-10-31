import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, updateStock, getLowStockProducts } from '../../services/productService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, low, out
  const [search, setSearch] = useState('');
  const [updatingStock, setUpdatingStock] = useState({});
  const [stockInputs, setStockInputs] = useState({});
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
      // Initialize stock inputs
      const inputs = {};
      data.forEach(p => inputs[p.id] = p.stock_quantity);
      setStockInputs(inputs);
    } catch (err) {
      setError('Failed to load inventory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStockUpdate = async (productId) => {
    const newQuantity = stockInputs[productId];
    if (newQuantity === undefined || newQuantity < 0) {
      alert('Please enter a valid quantity');
      return;
    }
    
    setUpdatingStock({ ...updatingStock, [productId]: true });
    try {
      await updateStock(productId, newQuantity);
      // Update local state
      setProducts(products.map(p =>
        p.id === productId ? { ...p, stock_quantity: newQuantity } : p
      ));
    } catch (err) {
      alert('Failed to update stock');
      console.error(err);
    } finally {
      setUpdatingStock({ ...updatingStock, [productId]: false });
    }
  };
  
  const handleStockInputChange = (productId, value) => {
    setStockInputs({ ...stockInputs, [productId]: parseInt(value) || 0 });
  };
  
  // Filter products
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                         product.sku.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Stock filter
    if (filter === 'low') return product.stock_quantity > 0 && product.stock_quantity < 10;
    if (filter === 'out') return product.stock_quantity === 0;
    
    return true;
  });
  
  const lowStockCount = products.filter(p => p.stock_quantity > 0 && p.stock_quantity < 10).length;
  const outOfStockCount = products.filter(p => p.stock_quantity === 0).length;
  
  if (loading) return <Loading />;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      
      {error && <ErrorMessage message={error} />}
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Products</p>
          <h3 className="text-3xl font-bold mt-2">{products.length}</h3>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Low Stock Items</p>
          <h3 className="text-3xl font-bold mt-2 text-orange-600">{lowStockCount}</h3>
          <p className="text-sm text-gray-500 mt-1">Less than 10 units</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Out of Stock</p>
          <h3 className="text-3xl font-bold mt-2 text-red-600">{outOfStockCount}</h3>
          <p className="text-sm text-gray-500 mt-1">Needs restocking</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border rounded-lg"
        />
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded ${filter === 'low' ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => setFilter('out')}
            className={`px-4 py-2 rounded ${filter === 'out' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            Out of Stock ({outOfStockCount})
          </button>
        </div>
      </div>
      
      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Product</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">SKU</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Current Stock</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Update Stock</th>
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
                <td className="px-4 py-3">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">${product.price}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {product.sku}
                </td>
                <td className="px-4 py-3 text-sm">
                  {product.category_name || 'N/A'}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-bold ${
                    product.stock_quantity === 0 ? 'text-red-600' :
                    product.stock_quantity < 10 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {product.stock_quantity} units
                  </span>
                  {product.stock_quantity === 0 && (
                    <p className="text-xs text-red-500">Out of stock</p>
                  )}
                  {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                    <p className="text-xs text-orange-500">Low stock</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={stockInputs[product.id] || 0}
                      onChange={(e) => handleStockInputChange(product.id, e.target.value)}
                      className="w-20 p-2 border rounded text-sm"
                      min="0"
                    />
                    <button
                      onClick={() => handleStockUpdate(product.id)}
                      disabled={updatingStock[product.id] || stockInputs[product.id] === product.stock_quantity}
                      className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                      {updatingStock[product.id] ? '...' : 'Update'}
                    </button>
                  </div>
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

export default InventoryPage;