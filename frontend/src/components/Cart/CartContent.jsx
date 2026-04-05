import React from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCartItemQuantity, clearCart as clearCartAction } from '../../redux/slices/cartSlice';

const CartContent = () => {
    const dispatch = useDispatch();
    const cartState = useSelector(state => state.cart.cart);
    const cartProducts = cartState?.products || [];
    const guestId = localStorage.getItem("guestId");
    const { user } = useSelector(state => state.auth);

    const handleRemove = (productId, size, color) => {
        dispatch(removeFromCart({ userId: user?._id, guestId, productId, size, color }));
    };

    const handleUpdateQty = (productId, size, color, quantity) => {
        dispatch(updateCartItemQuantity({ userId: user?._id, guestId, productId, size, color, quantity }));
    };

    const handleClearCart = () => {
        dispatch(clearCartAction());
    };

    const totalPrice = cartProducts.reduce((total, product) => {
        return total + (product.price * product.quantity)
    }, 0);

    return (
        <div>
            {cartProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
                    <p className="text-lg">Your cart is empty.</p>
                </div>
            ) : (
                <>
                {cartProducts.map((product, index) => (
                    <div key={`${product.productId}-${product.size}-${product.color}-${index}`} 
                    className='flex justify-between items-center space-x-4 mb-4 border-b border-gray-200 pb-4'>
                        <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} className='w-20 h-24 object-cover rounded shadow-sm'/>
                    
                        <div className='flex-1'>
                            <h3 className='text-md font-bold text-gray-800'>{product.name}</h3>
                            <div className='flex items-center space-x-2 text-sm text-gray-500 mt-1 mb-2'>
                                <span>Size: <span className="font-semibold text-gray-700">{product.size}</span></span>
                                <span>|</span>
                                <div className="flex items-center gap-1">
                                    <span>Color:</span>
                                    <span 
                                        className="inline-block w-4 h-4 rounded-full border border-gray-300"
                                        style={{backgroundColor: product.color}}
                                    ></span>
                                </div>
                            </div>
                            
                            <div className='flex items-center space-x-3 mt-2'>
                                <div className='flex items-center space-x-3 border border-gray-300 rounded-md px-2'>
                                    <button 
                                        disabled={product.quantity === 1}
                                        onClick={() => handleUpdateQty(product.productId, product.size, product.color, product.quantity - 1)} 
                                        className={`text-lg font-bold transition-colors ${product.quantity === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-black'}`}
                                    >
                                        -
                                    </button>
                                    <span className="font-semibold w-6 text-center">{product.quantity}</span>
                                    <button 
                                        disabled={product.quantity >= 10}
                                        onClick={() => handleUpdateQty(product.productId, product.size, product.color, product.quantity + 1)} 
                                        className={`text-lg font-bold transition-colors ${product.quantity >= 10 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-black'}`}
                                    >
                                        +
                                    </button>
                                </div>
                                <button 
                                    onClick={() => handleRemove(product.productId, product.size, product.color)} 
                                    className='text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-md transition-colors'
                                    aria-label="Remove item"
                                >
                                    <RiDeleteBin6Line className='h-5 w-5' />
                                </button>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className='text-md font-bold text-gray-800'>${(product.price * product.quantity).toFixed(2)}</p>
                        </div>

                    </div>  

                ))}
                
                <div className='mt-6 pt-4 border-t border-gray-200 flex justify-between items-center'>
                    <button 
                        onClick={handleClearCart}
                        className='text-red-500 hover:text-red-700 font-semibold text-sm flex items-center gap-2 transition-colors border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100'
                    >
                        <RiDeleteBin6Line />
                        Clear Cart
                    </button>
                    <div className='text-right'>
                        <span className='text-gray-500 text-sm mr-2'>Subtotal</span>
                        <span className='text-xl font-bold text-gray-800'>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
        
            </>
            )}
            
        
        </div>
        
        

    )
}

export default CartContent;