import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../../redux/slices/cartSlice';
import { toast } from 'sonner';

const BestSellers = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    
    // Local state
    const [bestSeller, setBestSeller] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestSeller = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/best-sellers`);
                if (response.data && response.data.length > 0) {
                    const topProduct = response.data[0];
                    setBestSeller(topProduct);
                    setMainImage(topProduct.images?.[0]?.url || '');
                    setSelectedColor(topProduct.colors?.[0] || '');
                    setSelectedSize(topProduct.sizes?.[0] || '');
                }
            } catch (error) {
                console.error("Failed to fetch best seller", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBestSeller();
    }, []);

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
             toast.error('Please select a size and color.');
             return;
        }

        const cartData = {
           productId: bestSeller._id,
           quantity,
           price: bestSeller.price,
           color: selectedColor,
           size: selectedSize,
           guestId: "guest_id", 
           userId: user ? user._id : undefined
        };

        dispatch(addToCart(cartData)).then((res) => {
             if (res.payload && res.payload._id) {
                 toast.success("Product added to cart successfully!", {
                     icon: "✅",
                 });
             }
        });
    };

    if (loading) return (
        <section className="py-16 bg-white w-full flex justify-center items-center">
            <p className="text-gray-500 animate-pulse font-semibold">Loading Best Seller...</p>
        </section>
    );
    if (!bestSeller) return null;

    return (
        <section className="py-20 bg-white w-full">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold mb-14 text-center text-gray-900 tracking-tight">Best Seller</h2>
                
                <div className="flex flex-col md:flex-row gap-12 items-start justify-center">
                    {/* Left: Image Gallery */}
                    <div className="flex flex-col-reverse sm:flex-row gap-4 md:w-[45%]">
                        {/* Thumbnails */}
                        <div className="flex sm:flex-col space-x-3 sm:space-x-0 sm:space-y-3 overflow-x-auto sm:overflow-visible">
                            {bestSeller.images && bestSeller.images.map((img, idx) => (
                                <img 
                                    key={idx}
                                    src={img.url}
                                    alt={`Thumbnail ${idx}`}
                                    onClick={() => setMainImage(img.url)}
                                    className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition-all ${mainImage === img.url ? 'border-gray-900' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                />
                            ))}
                        </div>
                        {/* Main Image */}
                        <div className="w-full h-auto bg-gray-100 rounded-lg flex-1 shadow-sm overflow-hidden">
                            <img 
                                src={mainImage} 
                                alt={bestSeller.name} 
                                className="w-full h-[500px] object-cover aspect-[4/5] sm:aspect-auto"
                            />
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="flex flex-col justify-start md:w-[45%]">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">{bestSeller.name}</h1>
                        
                        <div className="flex items-center space-x-3 mb-4">
                            {bestSeller.discount > 0 ? (
                                <>
                                  <span className="text-gray-400 line-through text-lg">${(bestSeller.price + bestSeller.discount).toFixed(2)}</span>
                                  <span className="text-2xl font-bold text-gray-900">${bestSeller.price.toFixed(2)}</span>
                                </>
                            ) : (
                                <span className="text-2xl font-bold text-gray-900">${bestSeller.price?.toFixed(2) || '0.00'}</span>
                            )}
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                            {bestSeller.description}
                        </p>

                        {/* Colors */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Color:</h3>
                            <div className="flex space-x-3">
                                {bestSeller.colors && bestSeller.colors.map((color, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedColor(color)}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        className={`w-8 h-8 rounded-full border border-gray-300 transform transition-transform shadow-sm focus:outline-none ${selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : ''}`}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Size:</h3>
                            <div className="flex flex-wrap gap-2">
                                {bestSeller.sizes && bestSeller.sizes.map((size, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-10 border flex items-center justify-center text-sm font-medium rounded-sm transition-colors focus:outline-none ${selectedSize === size ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quantity:</h3>
                            <div className="flex items-center">
                                <div className="flex items-center border border-gray-200 bg-gray-100 rounded-sm overflow-hidden">
                                    <button 
                                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors font-bold text-lg"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        -
                                    </button>
                                    <span className="w-10 h-10 flex items-center justify-center font-semibold bg-white border-l border-r border-gray-200 text-sm">{quantity}</span>
                                    <button 
                                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors font-bold text-lg"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleAddToCart}
                            className="w-full bg-black text-white py-4 text-sm font-bold rounded-sm uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-md active:scale-[0.99] mb-8"
                        >
                            ADD TO CART
                        </button>

                        {/* Characteristics */}
                        <div className="pt-6">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 tracking-wide">Characteristics:</h3>
                            <div className="grid grid-cols-2 gap-y-3 text-sm max-w-sm">
                                <p className="text-gray-500 font-medium">Brand</p>
                                <p className="text-gray-900 font-medium">{bestSeller.brand || 'N/A'}</p>
                                <p className="text-gray-500 font-medium">Material</p>
                                <p className="text-gray-900 font-medium">{bestSeller.material || 'N/A'}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default BestSellers;
