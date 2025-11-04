import { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import ErrorMessage from "../components/common/ErrorMessage";
import { fetchShippingZones, calculateShippingPreview } from "../services/shippingService"; 

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, getCartTotal } = useContext(CartContext); 

    const [shippingZones, setShippingZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState("");
    const [shippingCost, setShippingCost] = useState(0); 
    const [shippingMessage, setShippingMessage] = useState("");

    const [freeShippingThreshold, setFreeShippingThreshold] = useState(null); 
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 
    const [formData, setFormData] = useState({
        shipping_address: location.state?.address || "",
        notes: location.state?.notes || "",
    });
    const [errors, setErrors] = useState({});

    const cartTotal = getCartTotal();
    const finalTotal = cartTotal + shippingCost; 

    const loadShippingZones = async () => {
        try {
            const zones = await fetchShippingZones(); 
            setShippingZones(zones);
            const previousZone = location.state?.selectedZone || "";
            setSelectedZone(previousZone);
            if (zones.length === 1 && !previousZone) {
                setSelectedZone(zones[0].id);
            }
        } catch (err) {
            setError("Failed to load shipping options. Please try again.");
        }
    };

    const loadShippingPreview = useCallback(async (zoneId, total) => {
        if (!zoneId) {
            setShippingCost(0);
            setShippingMessage("Select a zone to calculate shipping.");
            setFreeShippingThreshold(null); 
            return;
        }
        try {
            const preview = await calculateShippingPreview(zoneId, total); 
            
            setFreeShippingThreshold(preview.free_shipping_threshold);

            setShippingCost(parseFloat(preview.shipping_cost) || 0); 
            setShippingMessage(preview.message || (preview.shipping_cost === 0 ? "Free Shipping" : ""));
            setError(null);
        } catch (err) {
            setShippingCost(0);
            setShippingMessage("");
            setFreeShippingThreshold(null);
            setError("Error calculating shipping cost. Please choose a valid zone.");
        }
    }, [cartTotal]);
    
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate("/cart");
            return;
        }
        loadShippingZones();
    }, [cartItems, navigate]);

    useEffect(() => {
        loadShippingPreview(selectedZone, cartTotal); 
    }, [selectedZone, cartTotal, loadShippingPreview]);
    
    const handleZoneChange = (e) => {
        setSelectedZone(e.target.value);
        setErrors(prev => ({...prev, shipping_zone: null}));
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.shipping_address.trim()) {
            newErrors.shipping_address = "Shipping address is required";
        }
        if (!selectedZone) {
            newErrors.shipping_zone = "Shipping zone is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) return;

        setLoading(true);
        try {
            const orderData = {
                shipping_address: formData.shipping_address,
                notes: formData.notes,
                shipping_zone: selectedZone, 
                shipping_cost: shippingCost, 
                order_items: cartItems.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
            };

            navigate("/payment", {
                state: {
                    orderData,
                    total: finalTotal, 
                    subtotal: cartTotal, 
                    shippingCost: shippingCost,
                    address: formData.shipping_address,
                    notes: formData.notes,
                    selectedZone: selectedZone,
                },
            });
        } catch (err) {
            setError("Failed to prepare order data.");
        } finally {
            setLoading(false);
        }
    };

    const getFreeShippingMessage = () => {
        if (freeShippingThreshold === null || freeShippingThreshold === 0) {
            return null;
        }

        const numericThreshold = parseFloat(freeShippingThreshold);

        if (isNaN(numericThreshold) || numericThreshold <= 0) {
             return null;
        }

        const remainingAmount = numericThreshold - cartTotal;

        if (shippingCost === 0 && remainingAmount <= 0) {
            return (
                <p className="text-sm font-semibold text-green-600 pt-1">
                    🎉 You qualified for FREE shipping!
                </p>
            );
        }

        if (remainingAmount > 0) {
            return (
                <p className="text-sm text-gray-600 pt-1">
                    Spend <span className="font-bold text-primary-600">${remainingAmount.toFixed(2)}</span> more to get FREE shipping!
                </p>
            );
        }
        
        return null;
    };
    
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
                    
                    {error && (<div className="mb-6"><ErrorMessage message={error} /></div>)}
                    
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                             <div className="card mb-6">
                                 <form onSubmit={handleSubmit} className="space-y-5">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Shipping Zone <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="shipping_zone"
                                            value={selectedZone}
                                            onChange={handleZoneChange}
                                            className={`input ${errors.shipping_zone ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">Select your shipping area</option>
                                            {shippingZones.map(zone => (
                                                <option key={zone.id} value={zone.id}>
                                                    {zone.name} ({zone.country})
                                                    {zone.base_rate > 0 && ` ($${parseFloat(zone.base_rate).toFixed(2)})`}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.shipping_zone && (
                                            <p className="text-red-500 text-sm mt-1">{errors.shipping_zone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Shipping Address <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="shipping_address"
                                            value={formData.shipping_address}
                                            onChange={handleChange}
                                            className={`input ${errors.shipping_address ? 'border-red-500' : ''}`}
                                            rows="4"
                                            placeholder="Enter your complete shipping address&#10;Include street, city, postal code, and country"
                                        />
                                        {errors.shipping_address && (
                                            <p className="text-red-500 text-sm mt-1">{errors.shipping_address}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Order Notes (Optional)
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            className="input"
                                            rows="3"
                                            placeholder="Any special instructions for this order..."
                                        />
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={loading || !selectedZone}
                                        className="w-full btn btn-primary py-4 text-lg font-semibold"
                                    >
                                        Proceed to Payment
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="card sticky top-20">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6 pb-6 border-b">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping ({selectedZone ? shippingMessage : 'Select zone'})</span>
                                        {shippingCost === 0 ? (
                                            <span className="font-semibold text-green-600">FREE</span>
                                        ) : (
                                            <span className="font-semibold">${shippingCost.toFixed(2)}</span>
                                        )}
                                    </div>

                                    {getFreeShippingMessage()}
                                    
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-lg">
                                            <span className="font-bold text-gray-900">Total</span>
                                            <span className="font-bold text-primary-600">
                                                ${finalTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
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
