import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="card card-hover group">
      <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-100">
        <img
          src={
            product.image_url ||
            "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
          }
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {product.category_name && (
          <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
            {product.category_name}
          </span>
        )}

        <div className="absolute bottom-2 left-2">
          {product.is_in_stock ? (
            product.is_low_stock ? (
              <span className="badge badge-warning">⚠️ Low Stock</span>
            ) : (
              <span className="badge badge-success">✓ In Stock</span>
            )
          ) : (
            <span className="badge badge-danger">✗ Out of Stock</span>
          )}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {product.stock_quantity} units
          </div>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="block w-full btn btn-primary text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
