import { useState, useEffect } from 'react';
import { getAllProducts } from '../services/productService';
import ProductList from '../components/products/ProductList';
import ProductFilters from '../components/products/ProductFilters';
import Loading from '../components/common/Loading';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    ordering: ''
  });
  
  useEffect(() => {
    loadProducts();
  }, [filters]);
  
  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllProducts(filters);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      ordering: ''
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">

        <div className="lg:w-1/4">
          <ProductFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="lg:w-3/4">
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="mb-4 text-gray-600">
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </div>
              <ProductList products={products} loading={loading} error={error} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;