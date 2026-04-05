import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <p className="text-center text-gray-500 py-10">Loading products...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500 py-10">Error loading products...</p>;
  }
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500 py-10">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link key={product._id || index} to={`/product/${product._id}`} className="block group">
          <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
            <div className="w-full h-96 mb-4 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.images?.[0]?.url || ''}
                alt={product.images?.[0]?.altText || product.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-sm mb-2 font-medium text-gray-900 truncate">{product.name}</h3>
            <p className="text-gray-500 font-bold text-sm tracking-tighter">
              $ {product.price?.toFixed(2)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
