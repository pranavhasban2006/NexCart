import React from 'react'
import { Link } from 'react-router-dom';
import { TbBrandFacebook, TbBrandTwitter, TbBrandInstagram, TbFilePhone } from 'react-icons/tb';
import { FaPhone } from 'react-icons/fa';
const Footer = () => {
  return (
    <footer className='w-full bg-gray-800 text-white py-12 mt-8 '>
        <div className='w-full grid grid-cols-1 md:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-12 xl:px-16'>
            <div className='mb-4 md:mb-0'>
                <h3 className='text-lg font-semibold mb-4'>Newsletter</h3>
                <p className='text-gray-300 mb-4'>
                  Be the first to know about new products, special offers, and promotions. Sign up for our newsletter and get 10% off your first order!
                </p>
                <p className='text-gray-300 mb-6 font-medium'>
                  get 10% off your first order!
                </p>
                <form className='flex mt-4'>
                  <input
                    type='email'
                    placeholder='Enter email'
                    className='bg-gray-700 text-white placeholder:text-gray-500 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                    rounded-md py-2 px-4 w-full transition-all duration-300 focus:border-blue-500'
                  />
                  <button
                    type='submit'
                    className='bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-300 mx-1'
                  >
                    Subscribe
                  </button>
                </form>
              </div >
              {/*shop links*/}
              <div className='mb-4 md:mb-0'>
                <h3 className='text-lg font-semibold mb-4'>Shop</h3>
                <ul className='text-gray-300'>
                  <li>
                     <Link to="#" className='mb-2 hover:text-white transition duration-300 cursor-pointer'>Men's Top wear</Link>
                  </li>
                  <li>
                     <Link to="#" className='mb-2 hover:text-white transition duration-300 cursor-pointer'>Women's Top wear</Link>
                  </li>
                  <li>
                     <Link to="#" className='mb-2 hover:text-white transition duration-300 cursor-pointer'>Men's Bottom wear</Link>
                  </li>
                  <li>
                     <Link to="#" className='mb-2 hover:text-white transition duration-300 cursor-pointer'>Women's Bottom wear</Link>
                  </li>
                    
                </ul>
                </div>
                
                {/*about us*/}
                <div className='mb-4 md:mb-0'>
                <h3 className='text-lg font-semibold mb-4'>About Us</h3>
                <ul className='text-gray-300'>
                  <li>
                     <Link to="#" className='mb-2 hover:text-white transition duration-300 cursor-pointer'>
                       About Us
                     </Link>
                  </li>
                  <li>
                     <Link to="#" className='mb-2 hover:text-white transition duration-300 cursor-pointer'>
                       Contact Us
                     </Link>
                  </li>
                  <li>
                     <Link to="#" className='mb-2 hover:text-white transition duration-300 cursor-pointer'>
                       FAQs
                     </Link>
                  </li>
                  <li>
                     <Link to="#" className='mb-2 hover:text-white transition duration-300 cursor-pointer'>
                       Features
                     </Link>
                  </li>
                  

                </ul>
              </div>
              {/*social media*/}
              <div className='mb-4 md:mb-0'>
                <h3 className='text-lg font-semibold mb-4'>Follow Us</h3>
                <div className='flex space-x-4'>
                  <a href="https://facebook.com" className='text-gray-300 hover:text-white transition duration-300'>
                    <TbBrandFacebook className='text-2xl' />
                  </a>
                  <a href="https://twitter.com" className='text-gray-300 hover:text-white transition duration-300'>
                    <TbBrandTwitter className='text-2xl' />
                  </a>
                  <a href="https://instagram.com" className='text-gray-300 hover:text-white transition duration-300'>
                    <TbBrandInstagram className='text-2xl' />
                  </a>
                </div>
                <p className='text-gray-300 mt-4'>
                  call us
                </p>
                <p className='text-gray-300 mt-2 flex items-center'>
                  <TbFilePhone className='text-2xl text-gray-300 hover:text-white transition duration-300' />
                  <span className='ml-2'>+91 1234567890</span>
                </p>
              </div>
        </div>
        {/*footer bottom*/}
        <div className='border-t border-gray-700 mt-8 pt-4 text-center text-gray-400'>
          &copy; {new Date().getFullYear()} NexCart. All rights reserved.
        </div>
              </footer>
  
            
  );

};


export default Footer;
