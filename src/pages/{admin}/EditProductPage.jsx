import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, updateProduct, deleteProduct } from '../../services/productService';
import ProductForm from '../../components/products/ProductForm';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  
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
  
  const handleSubmit = async (formData) => {
    setSaving(true);
    setError('');
    
    try {
      await updateProduct(id, formData);
      navigate('/admin/products', {
        state: { message: 'Product updated successfully!' }
      });
    } catch (err) {
      console.error(err);
      setError('Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    setDeleting(true);
    try {
      await deleteProduct(id);
      navigate('/admin/products', {
        state: { message: 'Product deleted successfully!' }
      });
    } catch (err) {
      alert('Failed to delete product. It may have pending orders.');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/admin/products')}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Products
      </button>
      
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:bg-gray-400"
          >
            {deleting ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <ProductForm 
            initialData={product}
            onSubmit={handleSubmit}
            loading={saving}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;