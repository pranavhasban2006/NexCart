import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const YouMayAlsoLike = () => {
    const { similarProducts, loading: reduxLoading } = useSelector((state) => state.products);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (similarProducts && similarProducts.length > 0) {
            setProducts(similarProducts);
        } else {
            // Fetch some general recommended products for the home page
            const fetchGeneralRecommendations = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
                        params: { limit: 4 }
                    });
                    setProducts(response.data);
                } catch (error) {
                    console.error("Error fetching recommendations:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchGeneralRecommendations();
        }
    }, [similarProducts]);

    if (loading || reduxLoading) return null;
    if (products.length === 0) return null;

    return (
        <section className="py-12 bg-white">
            <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center uppercase tracking-tighter">You May Also Like</h2>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10 sm:gap-x-8">
                    {products.map((product) => (
                        <Link to={`/product/${product._id}`} key={product._id} className="flex flex-col cursor-pointer group">
                            {/* Image Container with 4:3 aspect ratio */}
                            <div className="w-full aspect-[4/3] overflow-hidden rounded-lg mb-4 bg-gray-100 shadow-sm transition-shadow group-hover:shadow-md">
                                <img
                                    src={product.images?.[0]?.url || ''}
                                    alt={product.images?.[0]?.altText || product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Product Info */}
                            <h3 className="text-sm font-semibold text-gray-800 truncate uppercase tracking-tighter">{product.name}</h3>
                            <p className="text-gray-900 font-bold mt-1 text-sm">${product.price.toFixed(2)}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default YouMayAlsoLike;