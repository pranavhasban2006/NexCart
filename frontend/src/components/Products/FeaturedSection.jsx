import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedSection = () => {
    return (
        <section className="flex flex-col lg:flex-row items-stretch bg-white">
            {/* Left Side Text Content */}
            <div className="w-full lg:w-1/2 bg-[#eefdf0] p-10 lg:p-24 flex flex-col justify-center">
                <h4 className="text-sm font-semibold mb-2 text-gray-800">Comfort and Style</h4>
                <h2 className="text-4xl lg:text-7xl font-bold mb-6 text-gray-900 tracking-tighter">
                    Apparel made for your everyday life
                </h2>
                <p className="text-gray-600 mb-8 max-w-lg text-lg">
                    Discover high-quality, comfortable clothing that effortlessly blends fashion and
                    function. Designed to make you look and feel great every day.
                </p>
                <div>
                    <Link
                        to="/collections"
                        className="inline-block bg-black text-white px-8 py-3 rounded font-medium hover:bg-gray-800 transition-colors"
                    >
                        Shop Now
                    </Link>
                </div>
            </div>

            {/* Right Side Image */}
            <div className="w-full lg:w-1/2 h-[500px] lg:h-auto">
                <img
                    src="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                    alt="Featured Apparel"
                    className="w-full h-full object-cover"
                />
            </div>
        </section>
    );
};

export default FeaturedSection;
