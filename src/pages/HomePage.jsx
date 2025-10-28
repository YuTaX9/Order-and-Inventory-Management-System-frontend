import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import ProductCard from '../components/products/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  
  useEffect(() => {
    loadFeaturedProducts();
  }, []);
  
  const loadFeaturedProducts = async () => {
    try {
      const data = await getAllProducts({ ordering: '-created_at' });
      setFeaturedProducts(data.slice(0, 8));
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Inventory System</h1>
          <p className="text-xl mb-8">Find the best products at the best prices</p>
          <Link 
            to="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Browse Products
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link 
            to="/products"
            className="text-blue-600 hover:underline font-semibold"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;