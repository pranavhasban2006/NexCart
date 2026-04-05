import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || 'Unknown Order';
  const status = location.state?.status || 'Paid';

  const isFailed = status === 'Failed';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 text-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full transform transition-all hover:shadow-md">
        
        {/* Animated Checkmark or Cross SVG */}
        <div className={`mx-auto flex items-center justify-center h-24 w-24 rounded-full mb-6 relative ${isFailed ? 'bg-red-100' : 'bg-green-100'}`}>
          {isFailed ? (
            <svg
              className="h-12 w-12 text-red-600 animate-[bounce_1s_ease-in-out_1]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-12 w-12 text-green-600 animate-[bounce_1s_ease-in-out_1]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{isFailed ? 'Payment Failed' : 'Thank You!'}</h1>
        <p className="text-lg text-gray-600 mb-6">
          {isFailed 
            ? 'We were unable to process your payment. You can try again or check your recent orders.' 
            : 'Your payment was successful and your order has been confirmed.'}
        </p>
        
        <div className="bg-gray-50 rounded-lg p-5 mb-8 border border-gray-100 text-left">
          <p className="text-sm font-medium text-gray-500 mb-1">Order ID</p>
          <p className="text-gray-900 font-mono font-bold tracking-tight text-lg break-all">{orderId}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="w-full bg-black text-white px-6 py-3.5 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            Continue Shopping
          </Link>
          <Link
            to="/profile"
            className="w-full bg-white text-gray-700 border border-gray-300 px-6 py-3.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
