import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import PaypalButton from './PaypalButton';
import { createCheckout, finalizeCheckout, payCheckout } from '../redux/slices/checkoutSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading: cartLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { checkout, loading: checkoutLoading, error } = useSelector((state) => state.checkout);

  const cartItems = cart?.products || [];

  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
        navigate('/login?redirect=checkout');
    }
  }, [user, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total, product) => total + (product.price * product.quantity), 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const checkoutData = {
        checkoutItems: cartItems.map(item => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
        })),
        shippingAddress: {
            address: shippingAddress.address,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
        },
        paymentMethod: "PayPal",
        totalPrice: total,
    };

    // Create checkout session in backend
    const result = await dispatch(createCheckout(checkoutData));
    if (createCheckout.fulfilled.match(result)) {
        setShowPaymentOptions(true);
    }
  };

  const handlePaymentSuccess = async (details) => {
    console.log("Payment Successful", details);
    
    if (!checkout || !checkout._id) {
        console.error("Checkout session not found.");
        return;
    }

    // 1. Mark as paid
    const payResult = await dispatch(payCheckout({ 
        checkoutId: checkout._id, 
        paymentStatus: "paid", 
        paymentDetails: details 
    }));

    if (payCheckout.fulfilled.match(payResult)) {
        // 2. Finalize into an Order
        const finalizeResult = await dispatch(finalizeCheckout(checkout._id));
        
        if (finalizeCheckout.fulfilled.match(finalizeResult) && finalizeResult.payload) {
            dispatch(clearCart());
            navigate('/order-confirmation', { 
                state: { orderId: finalizeResult.payload._id, status: "Paid" } 
            });
        }
    }
  };

  const handlePaymentFailure = (err) => {
    console.error("Payment Failed", err);
  };

  if (cartLoading || checkoutLoading) {
    return <div className="flex justify-center items-center min-h-screen">Processing...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-12 mb-10">
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16">

        {/* Left Side: Checkout Form */}
        <div className="w-full md:w-[60%] lg:w-[65%]">
          <h1 className="text-3xl font-semibold mb-8 text-gray-900">CHECKOUT</h1>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error.message || error}</div>}

          <form onSubmit={handleCheckoutSubmit}>
            {/* Contact Details */}
            <h2 className="text-lg font-medium mb-4 text-gray-800">Contact Details</h2>
            <div className="mb-8">
              <label className="block text-sm text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full border border-gray-200 rounded-md p-3 bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
              />
            </div>

            {/* Delivery Details */}
            <h2 className="text-lg font-medium mb-4 text-gray-800">Delivery</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={shippingAddress.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-md p-3 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={shippingAddress.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-md p-3 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-sm"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1.5">Address</label>
              <input
                type="text"
                name="address"
                value={shippingAddress.address}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-md p-3 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-md p-3 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-md p-3 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-sm"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1.5">Country</label>
              <input
                type="text"
                name="country"
                value={shippingAddress.country}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-md p-3 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-sm"
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm text-gray-600 mb-1.5">Phone</label>
              <input
                type="tel"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-md p-3 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-sm"
                required
              />
            </div>

            {!showPaymentOptions ? (
              <button
                type="submit"
                disabled={cartItems.length === 0}
                className={`w-full py-4 font-medium rounded-md transition-colors shadow-sm ${
                  cartItems.length === 0 
                    ? "bg-gray-400 cursor-not-allowed text-gray-200" 
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Continue to Payment
              </button>
            ) : (
              <div className="mt-2">
                <h3 className="text-lg font-medium mb-4 text-gray-800">Pay with PayPal</h3>
                <PaypalButton amount={total} onSuccess={handlePaymentSuccess} onFailure={handlePaymentFailure} />
              </div>
            )}
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full md:w-[40%] lg:w-[35%]">
          <div className="bg-[#f9f9fa] rounded-lg p-6 lg:p-8 sticky top-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-medium mb-6 text-gray-800">Order Summary</h2>

            {cartItems.length === 0 ? (
              <div className="py-6 border-t border-b border-gray-200 text-center text-gray-500 mb-6 font-medium">
                Your cart is empty
              </div>
            ) : (
              <div className="mb-8 flex flex-col gap-6 border-b border-gray-200 pb-8">
                {cartItems.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex gap-4 items-center">
                    {/* Item Image */}
                    <div className="w-16 h-20 flex-shrink-0 bg-white border border-gray-200 rounded overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-900 text-sm xl:text-base leading-tight pr-4">{item.name}</h3>
                        <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>

                      {/* Color Display */}
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-sm text-gray-500">Color:</p>
                        <span
                          className="inline-block w-3 h-3 rounded-full border border-gray-400 shadow-sm"
                          style={{ backgroundColor: item.color }}
                        ></span>
                      </div>

                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Totals Section */}
            <div className="flex flex-col gap-4 text-sm text-gray-800 border-b border-gray-200 pb-6 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium">FREE</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-lg text-gray-900">Total</span>
              <span className="font-bold text-xl text-gray-900">${total.toFixed(2)}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
