import React from 'react';
import { HiOutlineShoppingBag, HiOutlineCreditCard } from 'react-icons/hi';
import { FiRefreshCcw } from 'react-icons/fi';

const FeaturesSection = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-around text-center">
                {/* Feature 1 */}
                <div className="flex flex-col items-center mb-10 md:mb-0">
                    <div className="mb-4">
                        <HiOutlineShoppingBag className="text-3xl text-gray-900" />
                    </div>
                    <h4 className="text-sm font-semibold tracking-tighter mb-2 text-gray-900">
                        FREE INTERNATIONAL SHIPPING
                    </h4>
                    <p className="text-sm text-gray-600 tracking-tight">On all orders over $100.00</p>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col items-center mb-10 md:mb-0">
                    <div className="mb-4">
                        <FiRefreshCcw className="text-3xl text-gray-900" />
                    </div>
                    <h4 className="text-sm font-semibold tracking-tighter mb-2 text-gray-900">
                        45 DAYS RETURN
                    </h4>
                    <p className="text-sm text-gray-600 tracking-tight">Money back guarantee</p>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col items-center">
                    <div className="mb-4">
                        <HiOutlineCreditCard className="text-3xl text-gray-900" />
                    </div>
                    <h4 className="text-sm font-semibold tracking-tighter mb-2 text-gray-900">
                        SECURE CHECKOUT
                    </h4>
                    <p className="text-sm text-gray-600 tracking-tight">100% secured checkout process</p>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
