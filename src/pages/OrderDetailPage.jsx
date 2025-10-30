import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getOrder, cancelOrder } from '../services/orderService';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  
  useEffect(() => {
    loadOrder();
    
    // Clear success message after 3 seconds
    if (successMessage) {
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  }, [id]);
  
  const loadOrder = async () => {
    try {
      const data = await getOrder(id);
      setOrder(data);
    } catch (err) {
      setError('Order not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    setCancelling(true);
    try {
      const updatedOrder = await cancelOrder(id);
      setOrder(updatedOrder);
      setSuccessMessage('Order cancelled successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    processing: 'bg-blue-100 text-blue-800 border-blue-300',
    shipped: 'bg-purple-100 text-purple-800 border-purple-300',
    delivered: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300'
  };
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return <ErrorMessage message="Order not found" />;
  
  const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-300';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/orders')}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Orders
      </button>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✓ {successMessage}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6 pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order #{order.order_number}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.order_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${statusColor}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.order_items.map(item => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <img
                  src={item.product_image || 'https://via.placeholder.com/100'}
                  alt={item.product_name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product_name}</h3>
                  <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                  <p className="text-gray-600 text-sm">Unit Price: ${parseFloat(item.unit_price).toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${parseFloat(item.subtotal).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
          <p className="text-gray-700 whitespace-pre-line">{order.shipping_address}</p>
          
          {order.notes && (
            <div className="mt-4">
              <h3 className="font-semibold mb-1">Order Notes</h3>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-2xl font-bold">
            <span>Total</span>
            <span className="text-blue-600">${parseFloat(order.total_amount).toFixed(2)}</span>
          </div>
        </div>

        {order.can_be_cancelled && (
          <div className="mt-6">
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition disabled:bg-gray-400"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;