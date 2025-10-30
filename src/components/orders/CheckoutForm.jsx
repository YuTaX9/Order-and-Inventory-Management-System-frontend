import { useState } from 'react';

const CheckoutForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    shipping_address: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Shipping address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Shipping Address <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.shipping_address}
          onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
          className="w-full p-3 border rounded-lg"
          rows="4"
          placeholder="Enter your complete shipping address"
        />
        {errors.shipping_address && (
          <p className="text-red-500 text-sm mt-1">{errors.shipping_address}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          className="w-full p-3 border rounded-lg"
          rows="3"
          placeholder="Any special instructions..."
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400"
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  );
};

export default CheckoutForm;