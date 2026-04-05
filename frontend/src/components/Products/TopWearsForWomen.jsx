import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TopWearsForWomen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetching Women's Top Wear from the API
                let response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
                    params: {
                        gender: 'Women',
                        category: 'Top Wear',
                        limit: 8
                    }
                });
                
                // Fallback: If no top wear, fetch any women's products
                if (response.data.length === 0) {
                    response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
                        params: {
                            gender: 'Women',
                            limit: 8
                        }
                    });
                }
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching Women's products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return (
        <section className="py-12 bg-white">
            <div className="text-center text-gray-500">Loading Women's Collection...</div>
        </section>
    );

    if (products.length === 0) return null;

    return (
        <section className="py-16 bg-white">
            <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 mx-auto border-t border-gray-100 pt-12">
                <h2 className="text-3xl font-bold mb-10 text-center uppercase tracking-tighter">Shop Women's Collection</h2>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12 sm:gap-x-8">
                    {products.map((product) => (
                        <Link to={`/product/${product._id}`} key={product._id} className="flex flex-col cursor-pointer group">
                            {/* Image Container with portrait aspect ratio */}
                            <div className="w-full aspect-[4/5] overflow-hidden rounded-lg mb-4 bg-gray-100 shadow-sm transition-shadow group-hover:shadow-md">
                                <img
                                    src={product.images?.[0]?.url || ''}
                                    alt={product.images?.[0]?.altText || product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Text underneath mapping left alignment and weight styling */}
                            <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate uppercase tracking-tighter">{product.name}</h3>
                            <p className="text-sm text-gray-500 font-bold">${product.price.toFixed(2)}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopWearsForWomen;
