import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useContext(CartContext);
  
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.stock_quantity) {
      alert(`Only ${item.stock_quantity} available in stock`);
      return;
    }
    updateQuantity(item.id, newQuantity);
  };
  
  const subtotal = (item.price * item.quantity).toFixed(2);
  
  return (
    <div className="flex gap-4 border-b py-4">

      <Link to={`/products/${item.id}`}>
        <img 
          src={item.image_url || 'https://via.placeholder.com/150'}
          alt={item.name}
          className="w-24 h-24 object-cover rounded"
        />
      </Link>

      <div className="flex-1">
        <Link to={`/products/${item.id}`} className="text-lg font-semibold hover:text-blue-600">
          {item.name}
        </Link>
        <p className="text-gray-600 text-sm">{item.category_name}</p>
        <p className="text-gray-600 text-sm">SKU: {item.sku}</p>
        <p className="text-blue-600 font-semibold mt-1">${item.price}</p>
        
        {item.quantity > item.stock_quantity && (
          <p className="text-red-500 text-sm mt-1">
            ⚠ Only {item.stock_quantity} available
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-gray-600">Quantity</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="w-16 text-center border rounded"
            min="1"
            max={item.stock_quantity}
          />
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
        <p className="text-sm text-gray-600">Max: {item.stock_quantity}</p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <p className="text-xl font-bold">${subtotal}</p>
        <button
          onClick={() => {
            if (window.confirm('Remove this item from cart?')) {
              removeFromCart(item.id);
            }
          }}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;