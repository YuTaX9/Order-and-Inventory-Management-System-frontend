import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <img 
        src={product.image_url || 'https://via.placeholder.com/300'} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-blue-600">${product.price}</span>
          {product.category_name && (
            <span className="bg-gray-200 px-2 py-1 rounded text-xs">
              {product.category_name}
            </span>
          )}
        </div>
        
        <div className="mb-3">
          {product.is_in_stock ? (
            <span className="text-green-600 text-sm">
              ✓ In Stock ({product.stock_quantity})
            </span>
          ) : (
            <span className="text-red-600 text-sm">✗ Out of Stock</span>
          )}
          {product.is_low_stock && product.is_in_stock && (
            <span className="text-orange-500 text-xs ml-2">⚠ Low Stock</span>
          )}
        </div>
        
        <Link 
          to={`/products/${product.id}`}
          className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;