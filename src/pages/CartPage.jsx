import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import ConfirmModal from "../components/common/ConfirmModal";
import ErrorMessage from "../components/common/ErrorMessage";

const CartPage = () => {
  const {
    cartItems = [],
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  } = useContext(CartContext) || {};

  const navigate = useNavigate();

  const [isClearingCart, setIsClearingCart] = useState(false);
  const [stockError, setStockError] = useState(null);

  const handleQuantityChange = (itemId, newQuantity, maxStock) => {
    setStockError(null);

    if (newQuantity < 1) return;
    if (newQuantity > maxStock) {
      setStockError(`Only ${maxStock} units available in stock.`);
      return;
    }
    updateQuantity?.(itemId, newQuantity);
  };

  const handleConfirmClearCart = () => {
    clearCart?.();
    setIsClearingCart(false);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart?.(itemId);
  };

  const hasStockIssue = cartItems.some(
    (item) => item.quantity > item.stock_quantity
  );
  const total = getCartTotal
    ? getCartTotal()
    : cartItems.reduce(
        (acc, item) => acc + parseFloat(item.price || 0) * (item.quantity || 0),
        0
      );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
               {" "}
        <div className="text-center">
                   {" "}
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                       {" "}
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
                           {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
                         {" "}
            </svg>
                     {" "}
          </div>
                   {" "}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h2>
                   {" "}
          <p className="text-gray-600 mb-8">
                        Looks like you haven't added anything to your cart yet  
                   {" "}
          </p>
                   {" "}
          <Link to="/products" className="btn btn-primary px-8">
                        Start Shopping          {" "}
          </Link>
                 {" "}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
           {" "}
      <div className="container mx-auto px-4">
               {" "}
        <div className="flex justify-between items-center mb-8">
                   {" "}
          <div>
                       {" "}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Shopping Cart
            </h1>
                       {" "}
            <p className="text-gray-600 mt-1">
                            {cartItems.length} item
              {cartItems.length !== 1 ? "s" : ""} in your cart            {" "}
            </p>
                     {" "}
          </div>
                   {" "}
          <button
            onClick={() => setIsClearingCart(true)}
            className="btn btn-outline text-red-600 hover:bg-red-50 border-red-600"
          >
                       {" "}
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
                           {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
                         {" "}
            </svg>
                        Clear Cart          {" "}
          </button>
                 {" "}
        </div>
        {stockError && (
          <div className="mb-6">
            <ErrorMessage message={stockError} />
          </div>
        )}
               {" "}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
                       {" "}
            {cartItems.map((item) => (
              <div key={item.id} className="card">
                               {" "}
                <div className="flex gap-4">
                                   {" "}
                  <Link to={`/products/${item.id}`} className="flex-shrink-0">
                                       {" "}
                    <img
                      src={
                        item.image_url ||
                        "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                      }
                      alt={item.name}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                    />
                                     {" "}
                  </Link>
                                   {" "}
                  <div className="flex-1">
                                       {" "}
                    <Link to={`/products/${item.id}`} className="block">
                                           {" "}
                      <h3 className="font-semibold text-gray-900 hover:text-primary-600 mb-1">
                                                {item.name}                     {" "}
                      </h3>
                                         {" "}
                    </Link>
                                       {" "}
                    {item.category_name && (
                      <span className="badge badge-info text-xs mb-2">
                                                {item.category_name}           
                                 {" "}
                      </span>
                    )}
                                       {" "}
                    <p className="text-sm text-gray-600 mb-2">
                      SKU: {item.sku}
                    </p>
                                       {" "}
                    <div className="flex items-center space-x-4 mb-3">
                                           {" "}
                      <span className="text-lg font-bold text-primary-600">
                                                $
                        {parseFloat(item.price).toFixed(2)}                     {" "}
                      </span>
                                           {" "}
                      {item.quantity > item.stock_quantity && (
                        <span className="text-xs text-red-600 font-semibold">
                                                    ⚠️ Only{" "}
                          {item.stock_quantity} available                      
                           {" "}
                        </span>
                      )}
                                         {" "}
                    </div>
                                       {" "}
                    <div className="flex items-center space-x-4">
                                           {" "}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                                               {" "}
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.quantity - 1,
                              item.stock_quantity
                            )
                          }
                          className="px-3 py-2 hover:bg-gray-100"
                        >
                                                   {" "}
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                                                       {" "}
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                                                     {" "}
                          </svg>
                                                 {" "}
                        </button>
                                               {" "}
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value) || 1,
                              item.stock_quantity
                            )
                          }
                          className="w-16 text-center border-x border-gray-300 py-2"
                          min="1"
                          max={item.stock_quantity}
                        />
                                               {" "}
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.quantity + 1,
                              item.stock_quantity
                            )
                          }
                          className="px-3 py-2 hover:bg-gray-100"
                          disabled={item.quantity >= item.stock_quantity}
                        >
                                                   {" "}
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                                                       {" "}
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                                                     {" "}
                          </svg>
                                                 {" "}
                        </button>
                                             {" "}
                      </div>
                                           {" "}
                      <button
                        onClick={() => {
                          handleRemoveItem(item.id);
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                      >
                                               {" "}
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                                                   {" "}
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                                                 {" "}
                        </svg>
                                                Remove                      {" "}
                      </button>
                                         {" "}
                    </div>
                                     {" "}
                  </div>
                                   {" "}
                  <div className="hidden md:block text-right">
                                       {" "}
                    <p className="text-sm text-gray-600 mb-1">Subtotal</p>     
                                 {" "}
                    <p className="text-xl font-bold text-gray-900">
                                            $
                      {(item.price * item.quantity).toFixed(2)}                 
                       {" "}
                    </p>
                                     {" "}
                  </div>
                                 {" "}
                </div>
                             {" "}
              </div>
            ))}
                     {" "}
          </div>
          <div>
                       {" "}
            <div className="card sticky top-20">
                           {" "}
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>
                           {" "}
              <div className="space-y-3 mb-6">
                               {" "}
                <div className="flex justify-between text-gray-600">
                                   {" "}
                  <span>Subtotal ({cartItems.length} items)</span>             
                      <span className="font-semibold">${total.toFixed(2)}</span>
                                 {" "}
                </div>
                               {" "}
                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>                 {" "}
                  <span className="font-semibold text-green-600">FREE</span>   
                             {" "}
                </div>
                               {" "}
                <div className="border-t pt-3">
                                   {" "}
                  <div className="flex justify-between text-lg">
                                       {" "}
                    <span className="font-bold text-gray-900">Total</span>     
                                 {" "}
                    <span className="font-bold text-primary-600">
                      ${total.toFixed(2)}
                    </span>
                                     {" "}
                  </div>
                                 {" "}
                </div>
                             {" "}
              </div>
                           {" "}
              {hasStockIssue && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                   {" "}
                  <p className="text-sm text-red-800 font-medium">
                                        ⚠️ Some items exceed available stock.
                    Please adjust quantities.                  {" "}
                  </p>
                                 {" "}
                </div>
              )}
                           {" "}
              <button
                onClick={() => navigate("/checkout")}
                disabled={hasStockIssue}
                className="w-full btn btn-primary py-4 text-lg font-semibold mb-3"
              >
                                Proceed to Checkout              {" "}
              </button>
                           {" "}
              <Link
                to="/products"
                className="block w-full btn btn-outline text-center"
              >
                                Continue Shopping              {" "}
              </Link>
                           {" "}
              <div className="mt-6 pt-6 border-t">
                               {" "}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                   {" "}
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                                       {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                                     {" "}
                  </svg>
                                    <span>Secure Checkout</span>               {" "}
                </div>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
        <ConfirmModal
          isOpen={isClearingCart}
          title="Confirm Clearing Cart"
          message="Are you sure you want to remove ALL items from your shopping cart? This action cannot be reversed."
          onConfirm={handleConfirmClearCart}
          onCancel={() => setIsClearingCart(false)}
          confirmText="Yes, Clear Cart"
          danger={true}
        />
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default CartPage;
