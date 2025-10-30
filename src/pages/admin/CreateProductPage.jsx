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
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/admin/products')}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Products
      </button>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Product</h1>
        
        {error && <ErrorMessage message={error} />}
        
        <div className="bg-white rounded-lg shadow p-6">
          <ProductForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;