import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/common/Loading';

import heroPattern from '../assets/hero-pattern.svg'; 

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      // جلب آخر 8 منتجات تم إنشاؤها
      const data = await getAllProducts({ ordering: '-created_at' });
      setFeaturedProducts(data.slice(0, 8));
    } catch (error) {
      console.error("Error loading featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section 
        className="bg-gray-900 text-white relative overflow-hidden"
        style={{
          backgroundImage: `url(${heroPattern})`, 
          backgroundSize: '1500px 1500px', 
          backgroundRepeat: 'repeat',
        }}
      >
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to InventoryHub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Your one-stop solution for inventory and order management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products"
                className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
              >
                Browse Products
              </Link>
              <Link 
                to="/register"
                className="px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-400 transition border-2 border-white/20"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        <div className="relative">
          <svg className="w-full h-12 md:h-20" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 8.33C120 16.7 240 33.3 360 41.7C480 50 600 50 720 45C840 40 960 30 1080 28.3C1200 26.7 1320 33.3 1380 36.7L1440 40V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose <span className="text-gradient">InventoryHub</span>?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card card-hover text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Intuitive interface designed for seamless navigation and quick actions
              </p>
            </div>

            <div className="card card-hover text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Optimized performance for quick loading and smooth operations
              </p>
            </div>

            <div className="card card-hover text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Your data is protected with industry-standard security measures
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم المنتجات المميزة الجديد */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Latest <span className="text-gradient">Products</span>
          </h2>

          {loading ? (
            <Loading /> // عرض مؤشر التحميل أثناء جلب المنتجات
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg">
              No featured products available at the moment.
            </p>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/products"
              className="btn btn-primary-outline"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section 
        className="py-16 bg-gray-900 text-white relative overflow-hidden" 
        style={{
          backgroundImage: `url(${heroPattern})`, 
          backgroundSize: '1500px 1500px',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of businesses managing their inventory efficiently
          </p>
          <Link 
            to="/register"
            className="inline-block px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;