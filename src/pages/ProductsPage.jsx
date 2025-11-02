import { useState, useEffect } from "react";
import { getAllProducts } from "../services/productService";
import ProductList from "../components/products/ProductList";
import ProductFilters from "../components/products/ProductFilters";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
    ordering: "",
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllProducts(filters);
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      inStock: false,
      ordering: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
           {" "}
      <div className="container mx-auto px-4">
               {" "}
        <div className="mb-8">
                   {" "}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Discover <span className="text-gradient">Products</span>
                     {" "}
          </h1>
                   {" "}
          <p className="text-gray-600">
            Browse our wide selection of quality products
          </p>
                 {" "}
        </div>
               {" "}
        <div className="flex flex-col lg:flex-row gap-8">
                   {" "}
          <div className="hidden lg:block lg:w-1/4">
                       {" "}
            <div className="sticky top-20">
                           {" "}
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className="lg:hidden">
                       {" "}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full btn btn-outline flex items-center justify-center space-x-2"
            >
                           {" "}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                               {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
                             {" "}
              </svg>
                            <span>Filters</span>           {" "}
            </button>
                       {" "}
            {showFilters && (
              <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
                               {" "}
                <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
                                   {" "}
                  <div className="flex justify-between items-center mb-4">
                                       {" "}
                    <h3 className="text-lg font-bold">Filters</h3>             
                         {" "}
                    <button onClick={() => setShowFilters(false)}>
                                           {" "}
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                                               {" "}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                                             {" "}
                      </svg>
                                         {" "}
                    </button>
                                     {" "}
                  </div>
                                   {" "}
                  <ProductFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                                 {" "}
                </div>
                             {" "}
              </div>
            )}
                     {" "}
          </div>
                   {" "}
          <div className="flex-1">
                       {" "}
            <div className="card mb-6">
                           {" "}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                               {" "}
                <div className="flex items-center space-x-2">
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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                                     {" "}
                  </svg>
                                   {" "}
                  <span className="text-gray-600">
                                       {" "}
                    {loading
                      ? "Loading..."
                      : `${products.length} product${
                          products.length !== 1 ? "s" : ""
                        } found`}
                                     {" "}
                  </span>
                                 {" "}
                </div>
                               {" "}
                <select
                  value={filters.ordering}
                  onChange={(e) =>
                    handleFilterChange("ordering", e.target.value)
                  }
                  className="input py-2 text-sm"
                >
                                    <option value="">Sort By: Default</option> 
                                 {" "}
                  <option value="price">Price: Low to High</option>             
                      <option value="-price">Price: High to Low</option>       
                            <option value="-created_at">Newest First</option>   
                                <option value="name">Name: A-Z</option>         
                          <option value="-name">Name: Z-A</option>             
                   {" "}
                </select>
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            {loading ? (
              <Loading />
            ) : error ? (
              <div className="mt-4">
                                <ErrorMessage message={error} />
              </div>
            ) : (
              <ProductList products={products} />
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

export default ProductsPage;
