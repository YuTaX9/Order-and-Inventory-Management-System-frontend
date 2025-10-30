import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import CheckoutForm from '../components/orders/CheckoutForm';
import ErrorMessage from '../components/common/ErrorMessage';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const handlePlaceOrder = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      const orderData = {
        shipping_address: formData.shipping_address,
        notes: formData.notes,
        order_items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      const order = await createOrder(orderData);

      clearCart();

      navigate(`/orders/${order.id}`, {
        state: { message: 'Order placed successfully!' }
      });

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const total = getCartTotal();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {error && <ErrorMessage message={error} />}
      <div className="grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <CheckoutForm onSubmit={handlePlaceOrder} loading={loading} />
          </div>
        </div>

        <div>
          <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-xl">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-green-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;