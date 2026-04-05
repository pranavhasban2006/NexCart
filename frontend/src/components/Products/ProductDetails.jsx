import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productsSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import YouMayAlsoLike from './YouMayAlsoLike';
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { product, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  
  // Guest ID fallback
  const [guestId] = useState(() => {
    let id = localStorage.getItem("guestId");
    if (!id) {
       id = "guest_" + Math.random().toString(36).substring(2, 10);
       localStorage.setItem("guestId", id);
    }
    return id;
  });
  
  const { setIsDrawerOpen } = useCart();
  
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails({ id }));
      dispatch(fetchSimilarProducts({ id }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    // Only set active view details when the fetched product strictly matches the URL route
    // to prevent showing ghost data from previous product visits
    if (product && product._id === id) { 
      setMainImage(product.images?.[0]?.url || '');
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product, id]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.");
      return;
    }

    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: id,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    ).then(() => {
        setIsButtonDisabled(false);
        setIsDrawerOpen(true);
        toast.success("Item added to cart successfully!", {
          icon: "✅",
        });
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]">Loading Product Details...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center min-h-[50vh] text-red-500">Error: {error?.message || error}</div>;
  }

  // Handle case where product might not be found or still resolving
  if (!product || Object.keys(product).length === 0 || product._id !== id) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-800">Product not found!</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-500 hover:underline">Return to Home</button>
      </div>
    );
  }

  const originalPrice = (product.price * 1.25).toFixed(2);
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div className="flex flex-col">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-10 mb-8 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          
          {/* Left Side: Images */}
          <div className="md:w-1/2 flex flex-col md:flex-row gap-4">
            
            {/* Thumbnails (Desktop) */}
            <div className="hidden md:flex flex-col gap-4 w-24 flex-shrink-0">
              {product.images?.map((img, index) => (
                <img 
                  key={index} 
                  src={img.url} 
                  alt={img.altText || `Thumbnail ${index}`} 
                  className={`w-full h-32 object-cover rounded-md cursor-pointer border-2 transition-all ${mainImage === img.url ? 'border-gray-800 opacity-100' : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400'}`}
                  onClick={() => setMainImage(img.url)}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px] lg:min-h-[600px]">
              <img 
                src={mainImage || 'https://via.placeholder.com/600'} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-crosshair" 
              />
            </div>

            {/* Mobile Thumbnails */}
            <div className="md:hidden flex gap-3 mt-4 overflow-x-auto pb-2">
              {product.images?.map((img, index) => (
                <div key={index} className="w-20 min-w-[5rem] aspect-[3/4] flex-shrink-0">
                  <img 
                    src={img.url} 
                    alt={img.altText || `Thumbnail ${index}`} 
                    className={`w-full h-full object-cover rounded-md cursor-pointer border-2 transition-all ${mainImage === img.url ? 'border-gray-800 opacity-100' : 'border-gray-200 opacity-80'}`}
                    onClick={() => setMainImage(img.url)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Product Details */}
          <div className="md:w-1/2 flex flex-col justify-start max-w-xl">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-gray-900 leading-tight">{product.name}</h1>
            
            <div className="mb-6 flex items-center gap-4">
              <p className="text-gray-500 line-through text-lg">${originalPrice}</p>
              <p className="text-3xl font-bold text-gray-900">$ {product.price?.toFixed(2)}</p>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-sm font-semibold">{discount}% OFF</span>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed text-base">
              {product.description || `This is a stylish ${product.category?.toLowerCase()} perfect for any occasion. Designed by ${product.brand}, it features a comfortable fit made from premium ${product.material?.toLowerCase()}.`}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <p className="font-semibold mb-3 text-gray-800">Color:</p>
              <div className="flex gap-3">
                {product.colors.map((color, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color.toLowerCase() }}
                    className={`w-10 h-10 rounded-full border border-gray-300 transition-all shadow-sm ${selectedColor === color ? 'ring-2 ring-offset-4 ring-gray-800 scale-110' : 'hover:scale-105'}`}
                    aria-label={`Select color ${color}`}
                  ></button>
                ))}
              </div>
            </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
            <div className="mb-8">
              <p className="font-semibold mb-3 text-gray-800">Size:</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3.5rem] h-12 px-2 border rounded-md font-medium text-sm transition-all shadow-sm ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            )}

            {/* Quantity */}
            <div className="mb-10">
              <p className="font-semibold mb-3 text-gray-800">Quantity:</p>
              <div className="flex items-center border border-gray-300 rounded-md w-max h-12 overflow-hidden bg-white shadow-sm">
                <button 
                  className="px-5 h-full text-xl text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >-</button>
                <span className="w-12 text-center font-medium text-gray-800 border-x border-gray-200">{quantity}</span>
                <button 
                  className="px-5 h-full text-xl text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => setQuantity(Math.min(product.countInStock || 10, quantity + 1))}
                >+</button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={isButtonDisabled || product.countInStock === 0}
              className={`w-full py-4 font-bold rounded-md transition-all mb-12 tracking-widest text-base shadow-lg active:scale-[0.99] ${
                isButtonDisabled || product.countInStock === 0 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800 hover:shadow-xl'
              }`}>
              {product.countInStock === 0 ? "OUT OF STOCK" : (isButtonDisabled ? "ADDING..." : "ADD TO CART")}
            </button>

            {/* Characteristics */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Characteristics:</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-100 last:border-0">
                    <td className="py-3 w-1/3 font-medium text-gray-500">Brand</td>
                    <td className="py-3 text-gray-800 font-medium">{product.brand || "N/A"}</td>
                  </tr>
                  <tr className="border-b border-gray-100 last:border-0">
                    <td className="py-3 w-1/3 font-medium text-gray-500">Material</td>
                    <td className="py-3 text-gray-800 font-medium">{product.material || "N/A"}</td>
                  </tr>
                  <tr className="border-b border-gray-100 last:border-0">
                    <td className="py-3 w-1/3 font-medium text-gray-500">Category</td>
                    <td className="py-3 text-gray-800 font-medium">{product.category || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-gray-500">Availability</td>
                    <td className="py-3 font-medium text-gray-800">{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200 mb-8"></div>
      
      {/* Dynamic You May Also Like Section */}
      <YouMayAlsoLike />
    </div>
  )
}

export default ProductDetails;