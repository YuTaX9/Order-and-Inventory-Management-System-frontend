import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

const CartSummary = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, getCartCount } = useContext(CartContext);

  const total = getCartTotal();
  const itemCount = getCartCount();

  const hasStockIssue = cartItems.some(
    (item) => item.quantity > item.stock_quantity
  );

  return (
    <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
      <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Items ({itemCount})</span>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">Free</span>
        </div>

        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between text-lg">
            <span className="font-bold">Total</span>
            <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {hasStockIssue && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
          ⚠ Some items exceed available stock. Please adjust quantities.
        </div>
      )}

      <button
        onClick={() => navigate("/checkout")}
        disabled={cartItems.length === 0 || hasStockIssue}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Proceed to Checkout
      </button>

      <button
        onClick={() => navigate("/products")}
        className="w-full mt-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default CartSummary;
