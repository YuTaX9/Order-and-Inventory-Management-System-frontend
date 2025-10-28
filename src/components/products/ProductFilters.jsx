import { useState, useEffect } from 'react';
import { getAllCategories } from '../../services/categoryService';

const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    loadCategories();
  }, []);
  
  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Search</label>
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-2 border rounded"
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          className="w-full p-2 border rounded"
          value={filters.category || ''}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 p-2 border rounded"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 p-2 border rounded"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={filters.inStock || false}
            onChange={(e) => onFilterChange('inStock', e.target.checked)}
          />
          <span className="text-sm">In Stock Only</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Sort By</label>
        <select
          className="w-full p-2 border rounded"
          value={filters.ordering || ''}
          onChange={(e) => onFilterChange('ordering', e.target.value)}
        >
          <option value="">Default</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
          <option value="name">Name: A-Z</option>
          <option value="-name">Name: Z-A</option>
        </select>
      </div>

      <button
        onClick={onClearFilters}
        className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default ProductFilters;