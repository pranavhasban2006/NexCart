import React from 'react'
import { IoMdClose } from 'react-icons/io';
import CartContent from '../Cart/CartContent';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

function CartDrawer() {
    const { isDrawerOpen, toggleCartDrawer } = useCart();
    const navigate = useNavigate();
    
    const handleCheckout = () => {
      toggleCartDrawer();
      navigate('/checkout');
    };
    
  return (
    <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg
        transition-transform duration-300 flex flex-col z-50 
        ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* close button */}
            <button onClick={toggleCartDrawer} className='self-end p-4 text-gray-600 hover:text-gray-800'>
            <IoMdClose  className='h-5 w-5 text-gray-700 hover:text-[#9caebb]' />

            
            </button>
            {/* Cart items */}
            <div className='grow p-4 overflow-y-auto'>
                <h2 className='text-xl font-semibold mb-4'>Your Cart</h2>
                <CartContent />
            </div>
            {/* Checkout button */}
            <div className='p-4 bg-white sticky bottom-0 border-t'>
                <button 
                  onClick={handleCheckout}
                  className='w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors duration-300'
                >
                    Proceed to Checkout
                </button>
                <p className='text-sm tracking-tighter text-gray-500 mt-2 text-center'>shipping, taxes, and fees calculated at checkout.</p>
                
                    
            </div>

        </div>
  )
}

export default CartDrawer