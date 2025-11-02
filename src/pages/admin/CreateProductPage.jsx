import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../services/productService';
import ProductForm from '../../components/products/ProductForm';
import ErrorMessage from '../../components/common/ErrorMessage';

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      await createProduct(formData);
      navigate('/admin/products', {
        state: { message: 'Product created successfully!' }
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.sku?.[0] || 'Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* 👇 زر العودة بتصميم جديد */}
          <button
            onClick={() => navigate('/admin/products')}
            className="mb-6 flex items-center text-gray-600 hover:text-primary-600 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>
          
          {/* 👇 العنوان بتنسيق لوحة الإدارة */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Create <span className="text-gradient">New Product</span>
          </h1>
          
          {error && <ErrorMessage message={error} />}
          
          <div className="card"> {/* استخدام تنسيق "card" بدلاً من div bg-white */}
            <ProductForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;