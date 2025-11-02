import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import ErrorMessage from '../components/common/ErrorMessage';
import Loading from '../components/common/Loading';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { clearCart } = useContext(CartContext);

    const { orderData, total, address } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('card');

    useEffect(() => {
        if (!orderData || orderData.order_items.length === 0) {
            navigate('/cart');
        }
    }, [orderData, navigate]);

    const handleProcessPayment = async () => {
        setLoading(true);
        setError(null);

        try {

            await new Promise(resolve => setTimeout(resolve, 1500)); 

            const finalOrderData = { ...orderData, payment_method: paymentMethod };

            const orderResponse = await createOrder(finalOrderData);
            console.log('Created order:', orderResponse);

            const orderId = orderResponse.id || orderResponse.order?.id;
            const orderNumber = orderResponse.order_number || orderResponse.order?.order_number;

            if (!orderId) {
             throw new Error('Order ID not found in API response');
            }

            clearCart();
            navigate(`/orders/${orderId}`, {
              state: { message: `Order #${orderNumber || orderId} has been placed successfully!` }
            });

            clearCart();
            navigate(`/orders/${order.id}`, {
                state: { message: `Order #${order.order_number} has been placed successfully!` }
            });

        } catch (err) {
            setError(err.response?.data?.error || 'Payment failed. Please check your card details or try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !error) return <Loading />;
    if (!orderData || orderData.order_items.length === 0) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="flex items-center justify-center">

                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                            <span className="ml-2 text-sm font-medium text-gray-900">Cart</span>
                        </div>
                        
                        <div className="w-16 h-1 bg-primary-600 mx-4"></div>

                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                            <span className="ml-2 text-sm font-medium text-gray-900">Checkout</span>
                        </div>
                        
                        <div className="w-16 h-1 bg-primary-600 mx-4"></div>

                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold animate-pulse">3</div>
                            <span className="ml-2 text-sm font-medium text-gray-900">Payment</span>
                        </div>
                        
                        <div className="w-16 h-1 bg-gray-300 mx-4"></div>

                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">4</div>
                            <span className="ml-2 text-sm font-medium text-gray-500">Complete</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Finalize Payment</h1>
                    
                    {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

                    <div className="grid lg:grid-cols-3 gap-8">

                        <div className="lg:col-span-2">
                            <div className="card">
                                <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>

                                <div className space-y-4 mb-8>
                                    <label className="flex items-center space-x-3 card bg-primary-50 p-4 cursor-pointer">
                                        <input 
                                            type="radio"
                                            name="payment"
                                            value="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="form-radio text-primary-600 h-5 w-5"
                                        />
                                        <div className='flex-1'>
                                            <span className="font-semibold text-gray-900">Credit/Debit Card</span>
                                            <div className="text-xs text-gray-600 flex space-x-2 mt-1">
                                                <span>VISA</span>
                                                <span>MasterCard</span>
                                                <span>Amex</span>
                                            </div>
                                        </div>
                                    </label>
                                    <label className="flex items-center space-x-3 card bg-gray-100 p-4 cursor-pointer">
                                        <input 
                                            type="radio"
                                            name="payment"
                                            value="paypal"
                                            checked={paymentMethod === 'paypal'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="form-radio text-primary-600 h-5 w-5"
                                        />
                                        <span className="font-semibold text-gray-900">PayPal</span>
                                    </label>
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Card Number" className="input" required />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder="MM/YY" className="input" required />
                                            <input type="text" placeholder="CVC" className="input" required />
                                        </div>
                                        <input type="text" placeholder="Cardholder Name" className="input" required />
                                    </div>
                                )}

                            </div>

                            <div className="mt-6 flex justify-between">
                                <button
                                    onClick={() => navigate('/checkout', { state: { address, notes: orderData.notes } })}
                                    className="btn btn-outline text-gray-600"
                                >
                                    ← Back to Shipping
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="card sticky top-20">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Summary</h2>

                                <div className="space-y-3 mb-6 pb-6 border-b">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({orderData.order_items.length} items)</span>
                                        <span className="font-semibold">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="font-semibold text-green-600">FREE</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-xl">
                                            <span className="font-bold text-gray-900">Total Due</span>
                                            <span className="font-bold text-primary-600">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <h3 className='text-sm font-semibold mb-2'>Ship To:</h3>
                                    <p className='text-xs text-gray-700 whitespace-pre-line'>{address}</p>
                                </div>

                                <button
                                    onClick={handleProcessPayment}
                                    disabled={loading}
                                    className="w-full btn btn-success py-3 text-lg font-semibold"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing Payment...
                                        </span>
                                    ) : (
                                        `Pay $${total.toFixed(2)} Now`
                                    )}
                                </button>
                                
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;