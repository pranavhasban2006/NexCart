import React from 'react'
import { Link } from 'react-router-dom'
import {HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight} from 'react-icons/hi2';
import SearchBar from './SearchBar';
import CartDrawer from '../Layout/CartDrawer';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const { cart, toggleCartDrawer } = useCart();
    const [newdrawerOpen, setNewDrawerOpen] = useState(false);
    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
    const toggleNewDrawer = () => {
        setNewDrawerOpen(!newdrawerOpen);
    }
    

  return (
    <>
        <nav className='w-full flex items-center justify-between py-4 px-4 sm:px-6 lg:px-12 xl:px-16 bg-white shadow-md'>
            {/* Logo */ }

            <div >
                <Link to="/" className='text-gray-600 text-2xl font-bold hover:text-[#9caebb]'>
                    NexCart
                </Link>
            </div>
            {/* Navigation Links */ }
            <div className='hidden md:flex items-center space-x-6'>
                <Link to="/collections?gender=Men" className='text-gray-600 hover:text-[#9caebb] text-sm font-medium uppercase'>
                    MEN
                </Link>
                <Link to="/collections?gender=Women" className='text-gray-600 hover:text-[#9caebb] text-sm font-medium uppercase'>
                    WOMEN
                </Link>
                <Link to="/collections?category=Top Wear" className='text-gray-600 hover:text-[#9caebb] text-sm font-medium uppercase'>
                    TOP Wear
                </Link>
                <Link to="/collections?category=Bottom Wear" className='text-gray-600 hover:text-[#9caebb] text-sm font-medium uppercase'>
                    BOTTOM wear
                </Link>
            </div>
                {/* right side User Actions */ }
            <div className='flex items-center space-x-4'>
                <Link to="/admin" className='bg-black px-2 py-1 text-sm text-white rounded-md font-medium hover:bg-gray-800 transition-colors'>
                    Admin
                </Link>
                <Link to="/profile" className='hover:text-black'>
                    <HiOutlineUser className='h-5 w-5 text-gray-700 hover:text-[#9caebb]'/>
                </Link>
                <button
                    onClick={toggleCartDrawer} 
                    className='relative hover:text-black mt-1'
                >
                    <HiOutlineShoppingBag className='h-5 w-5 text-gray-700 hover:text-[#9caebb] transition-colors'/>
                    {cartItemsCount > 0 && (
                        <span className='absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm'>
                            {cartItemsCount}
                        </span>
                    )}
                </button>
                {/* Search Bar */ 
                }
                <div className='overflow-hidden'>
                    </div>
                <SearchBar />
                <button onClick={toggleNewDrawer} 
                className=''>
                    <HiBars3BottomRight className='h-5 w-5 text-gray-700 hover:text-[#9caebb] '/>
                </button>
            </div>
        </nav>
        <CartDrawer />
        {/* mobile menu drawer */
        }
        <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full 
         bg-white shadow-lg z-40 transform transition-transform duration-300
            ${newdrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className='flex justify-end p-4'>
                <button onClick={toggleNewDrawer} className='text-gray-600 hover:text-gray-800'>
                    <IoMdClose className='h-5 w-5 text-gray-700 hover:text-[#9caebb]' />

                </button>
            </div>
            <div className='h-6 w-6 text-gray-600'>
                <h2 className='text-gray-800 text-xl font-semibold mb-4 text-center p-2'>Menu</h2>
                <nav className='space-y-4'>
                    <Link to="/collections?gender=Men" className='block text-gray-600 hover:text-[#9caebb] text-sm font-medium uppercase py-2 px-4'>
                        MEN
                    </Link>
                    <Link to="/collections?gender=Women" className='block text-gray-600 hover:text-[#9caebb] text-sm font-medium uppercase py-2 px-4'>
                        WOMEN
                    </Link>
                    
                    <Link to="/collections?category=Top Wear" className='block text-gray-600 hover:text-[#9caebb] text-sm font-medium uppercase py-2 px-4 whitespace-nowrap'>
                       TOP WEAR
                    </Link>

                    <Link to="/collections?category=Bottom Wear" className='block text-gray-600 hover:text-[#9caebb] text-sm font-medium uppercase py-2 px-4 whitespace-nowrap'>
                        BOTTOM WEAR
                    </Link>
                </nav>
            </div>
            </div>


            
    </>
  )
}

export default Navbar