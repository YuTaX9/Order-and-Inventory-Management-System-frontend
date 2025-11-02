import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getOrder, cancelOrder } from '../services/orderService';
import Loading from '../components/common/Loading';
// 👇 استيراد مكونات الرسائل والتأكيد
import { SuccessMessage } from '../components/common/SuccessMessage';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmModal from '../components/common/ConfirmModal'; 

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null); // 👈 إضافة حالة الخطأ
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [showCancelModal, setShowCancelModal] = useState(false); // 👈 حالة مودال الإلغاء

  useEffect(() => {
    loadOrder();
    if (successMessage) {
      // لإخفاء الرسائل القادمة من حالة الموقع (location.state)
      setTimeout(() => setSuccessMessage(''), 5000); 
    }
  }, [id]);

  const loadOrder = async () => {
    setError(null);
    try {
      const data = await getOrder(id);
      setOrder(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  // دالة فتح مودال التأكيد
  const handleInitialCancel = () => {
    setError(null); // مسح الأخطاء السابقة
    setShowCancelModal(true);
  };

  // دالة تنفيذ الإلغاء بعد التأكيد
  const handleConfirmCancel = async () => {
    setShowCancelModal(false);
    setCancelling(true);
    
    try {
      const updatedOrder = await cancelOrder(id);
      setOrder(updatedOrder);
      setSuccessMessage('Order cancelled successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      // 👈 استخدام ErrorMessage بدلاً من alert
      setError(err.response?.data?.error || 'Failed to cancel order. The order status might be too advanced.');
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

  const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];

  if (loading) return <Loading />;
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error ? (
          <ErrorMessage message={error} />
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
            <button onClick={() => navigate('/orders')} className="btn btn-primary">
              Back to Orders
            </button>
          </div>
        )}
      </div>
    );
  }

  const currentStepIndex = order.status === 'cancelled' ? -1 : statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </button>

        {/* 🚨 رسائل النجاح والخطأ */}
        {successMessage && (
            <div className="mb-6">
                <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
            </div>
        )}
        {error && <ErrorMessage message={error} />}


        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.order_number}
              </h1>
              <p className="text-gray-600 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Placed on {new Date(order.order_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <span className={`px-6 py-3 rounded-lg text-lg font-semibold border-2 ${statusColors[order.status]} capitalize`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {order.status !== 'cancelled' && (
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                <div 
                  className="h-full bg-primary-600 transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                ></div>
              </div>

              <div className="relative flex justify-between">
                {statusSteps.map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-all ${
                      index <= currentStepIndex 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index < currentStepIndex ? '✓' : index + 1}
                    </div>
                    <p className={`mt-2 text-sm font-medium capitalize ${
                      index <= currentStepIndex ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.order_items.map(item => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <img
                      src={item.product_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150'}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.product_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Quantity: {item.quantity}</span>
                        <span>×</span>
                        <span>${parseFloat(item.unit_price).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        ${parseFloat(item.subtotal).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total Amount</span>
                  <span className="text-3xl font-bold text-primary-600">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Shipping Address
              </h3>
              <p className="text-gray-700 whitespace-pre-line text-sm">
                {order.shipping_address}
              </p>
            </div>

            {order.notes && (
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Order Notes
                </h3>
                <p className="text-gray-700 text-sm">{order.notes}</p>
              </div>
            )}

            {order.can_be_cancelled && (
              <div className="card bg-red-50 border-red-200">
                <h3 className="text-lg font-bold text-red-900 mb-3">Cancel Order</h3>
                <p className="text-sm text-red-700 mb-4">
                  You can cancel this order since it's still pending. Stock will be restored.
                </p>
                <button
                  onClick={handleInitialCancel} // 👈 استخدام دالة فتح المودال
                  disabled={cancelling}
                  className="w-full btn btn-danger"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* 🚨 مودال التأكيد للحذف */}
        <ConfirmModal
          isOpen={showCancelModal}
          title="Confirm Order Cancellation"
          message={`Are you sure you want to cancel order #${order.order_number}? This action cannot be reversed.`}
          onConfirm={handleConfirmCancel}
          onCancel={() => setShowCancelModal(false)}
          confirmText="Yes, Cancel Order"
          danger={true}
        />
        
      </div>
    </div>
  );
};

export default OrderDetailPage;