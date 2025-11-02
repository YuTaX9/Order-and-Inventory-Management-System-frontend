import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, updateStock } from "../../services/productService";
import Loading from "../../components/common/Loading";
import { SuccessMessage } from "../../components/common/SuccessMessage"; // 👈 استيراد مكون رسالة النجاح
import ErrorMessage from "../../components/common/ErrorMessage"; // 👈 استيراد مكون رسالة الخطأ (اختياري، أو نستخدم div بسيط)

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingStock, setUpdatingStock] = useState({});
  const [stockInputs, setStockInputs] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data);
      const inputs = {};
      data.forEach((p) => (inputs[p.id] = p.stock_quantity));
      setStockInputs(inputs);
    } catch (err) {
      console.error(err);
      setError("Failed to load inventory data. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (productId) => {
    const newQuantity = stockInputs[productId];

    setError(null);
    setSuccessMessage("");

    if (newQuantity === undefined || newQuantity < 0) {
      setError("Please enter a valid quantity (0 or greater).");
      return;
    }

    setUpdatingStock({ ...updatingStock, [productId]: true });
    try {
      await updateStock(productId, newQuantity);
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, stock_quantity: newQuantity } : p
        )
      );
      setSuccessMessage(
        `Stock updated successfully for SKU: ${
          products.find((p) => p.id === productId)?.sku
        }`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to update stock. Please try again.");
    } finally {
      setUpdatingStock({ ...updatingStock, [productId]: false });
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === "low")
      return product.stock_quantity > 0 && product.stock_quantity < 10;
    if (filter === "out") return product.stock_quantity === 0;
    return true;
  });

  const lowStockCount = products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity < 10
  ).length;
  const outOfStockCount = products.filter((p) => p.stock_quantity === 0).length;

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
           {" "}
      <div className="container mx-auto px-4">
               {" "}
        <div className="mb-8">
                   {" "}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Inventory{" "}
            <span className="text-gradient">Management</span>         {" "}
          </h1>
                   {" "}
          <p className="text-gray-600">Monitor and update your stock levels</p> 
               {" "}
        </div>
        {(error || successMessage) && (
          <div className="mb-6">
            {successMessage && (
              <SuccessMessage
                message={successMessage}
                onClose={() => setSuccessMessage("")}
              />
            )}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-semibold">{error}</p>
              </div>
            )}
          </div>
        )}
               {" "}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
                   {" "}
          <div className="card border-l-4 border-primary-600">
                       {" "}
            <div className="flex items-center justify-between">
                           {" "}
              <div>
                               {" "}
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Products
                </p>
                               {" "}
                <h3 className="text-3xl font-bold text-gray-900">
                  {products.length}
                </h3>
                             {" "}
              </div>
                           {" "}
              <div className="p-3 bg-primary-100 rounded-lg">
                               {" "}
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                                   {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                                 {" "}
                </svg>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className="card border-l-4 border-orange-500">
                       {" "}
            <div className="flex items-center justify-between">
                             {" "}
              <div>
                               {" "}
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Low Stock Items
                </p>
                               {" "}
                <h3 className="text-3xl font-bold text-orange-600">
                  {lowStockCount}
                </h3>
                               {" "}
                <p className="text-xs text-gray-500 mt-1">Less than 10 units</p>
                             {" "}
              </div>
                           {" "}
              <div className="p-3 bg-orange-100 rounded-lg">
                               {" "}
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                                   {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                                 {" "}
                </svg>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className="card border-l-4 border-red-500">
                       {" "}
            <div className="flex items-center justify-between">
                           {" "}
              <div>
                               {" "}
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Out of Stock
                </p>
                               {" "}
                <h3 className="text-3xl font-bold text-red-600">
                  {outOfStockCount}
                </h3>
                               {" "}
                <p className="text-xs text-gray-500 mt-1">Needs restocking</p> 
                           {" "}
              </div>
                           {" "}
              <div className="p-3 bg-red-100 rounded-lg">
                               {" "}
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                                   {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                                 {" "}
                </svg>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <div className="card mb-6">
                   {" "}
          <div className="flex flex-col md:flex-row gap-4">
                       {" "}
            <div className="relative flex-1">
                           {" "}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                               {" "}
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                                   {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                                 {" "}
                </svg>
                             {" "}
              </div>
                           {" "}
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
                         {" "}
            </div>
                       {" "}
            <div className="flex gap-2">
                           {" "}
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === "all"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                                All ({products.length})              {" "}
              </button>
                           {" "}
              <button
                onClick={() => setFilter("low")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === "low"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                                Low Stock ({lowStockCount})              {" "}
              </button>
                           {" "}
              <button
                onClick={() => setFilter("out")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === "out"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                                Out of Stock ({outOfStockCount})              {" "}
              </button>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <div className="card overflow-hidden">
                   {" "}
          <div className="overflow-x-auto">
                       {" "}
            <table className="w-full">
                           {" "}
              <thead className="bg-gray-50 border-b">
                               {" "}
                <tr>
                                   {" "}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Product
                  </th>
                                   {" "}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    SKU
                  </th>
                                   {" "}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Category
                  </th>
                                   {" "}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Current Stock
                  </th>
                                   {" "}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Update Stock
                  </th>
                                   {" "}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                                 {" "}
                </tr>
                             {" "}
              </thead>
                           {" "}
              <tbody className="divide-y">
                               {" "}
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                                       {" "}
                    <td className="px-6 py-4">
                                           {" "}
                      <div className="flex items-center space-x-3">
                                               {" "}
                        <img
                          src={
                            product.image_url ||
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100"
                          }
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                                               {" "}
                        <div>
                                                   {" "}
                          <p className="font-semibold text-gray-900">
                            {product.name}
                          </p>
                                                   {" "}
                          <p className="text-sm text-gray-500">
                            ${parseFloat(product.price).toFixed(2)}
                          </p>
                                                 {" "}
                        </div>
                                             {" "}
                      </div>
                                         {" "}
                    </td>
                                       {" "}
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                                            {product.sku}                   {" "}
                    </td>
                                       {" "}
                    <td className="px-6 py-4">
                                           {" "}
                      {product.category_name ? (
                        <span className="badge badge-info">
                          {product.category_name}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                                         {" "}
                    </td>
                                       {" "}
                    <td className="px-6 py-4">
                                           {" "}
                      <div>
                                               {" "}
                        <span
                          className={`text-lg font-bold ${
                            product.stock_quantity === 0
                              ? "text-red-600"
                              : product.stock_quantity < 10
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                                                    {product.stock_quantity}{" "}
                          units                        {" "}
                        </span>
                                               {" "}
                        {product.stock_quantity === 0 && (
                          <p className="text-xs text-red-600 mt-1 font-semibold">
                            Out of stock
                          </p>
                        )}
                                               {" "}
                        {product.stock_quantity > 0 &&
                          product.stock_quantity < 10 && (
                            <p className="text-xs text-orange-600 mt-1 font-semibold">
                              Low stock
                            </p>
                          )}
                                             {" "}
                      </div>
                                         {" "}
                    </td>
                                       {" "}
                    <td className="px-6 py-4">
                                           {" "}
                      <div className="flex items-center space-x-2">
                                               {" "}
                        <input
                          type="number"
                          value={stockInputs[product.id] || 0}
                          onChange={(e) =>
                            setStockInputs({
                              ...stockInputs,
                              [product.id]: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-24 p-2 border border-gray-300 rounded-lg text-sm"
                          min="0"
                        />
                                               {" "}
                        <button
                          onClick={() => handleStockUpdate(product.id)}
                          disabled={
                            updatingStock[product.id] ||
                            stockInputs[product.id] === product.stock_quantity
                          }
                          className="btn btn-primary text-sm px-4"
                        >
                                                   {" "}
                          {updatingStock[product.id] ? (
                            <svg
                              className="animate-spin h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                                                           {" "}
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                                                           {" "}
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                                                         {" "}
                            </svg>
                          ) : (
                            "Update"
                          )}
                                                 {" "}
                        </button>
                                             {" "}
                      </div>
                                         {" "}
                    </td>
                                       {" "}
                    <td className="px-6 py-4">
                                           {" "}
                      <div className="flex items-center space-x-3">
                                               {" "}
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                                                    Edit                        {" "}
                        </Link>
                                               {" "}
                        <span className="text-gray-300">|</span>               
                               {" "}
                        <Link
                          to={`/products/${product.id}`}
                          className="text-gray-600 hover:text-gray-700 font-medium text-sm"
                        >
                                                    View                        {" "}
                        </Link>
                                             {" "}
                      </div>
                                         {" "}
                    </td>
                                     {" "}
                  </tr>
                ))}
                             {" "}
              </tbody>
                         {" "}
            </table>
                       {" "}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                               {" "}
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                                   {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                                 {" "}
                </svg>
                               {" "}
                <p className="text-gray-600 font-semibold">No products found</p>
                             {" "}
              </div>
            )}
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default InventoryPage;