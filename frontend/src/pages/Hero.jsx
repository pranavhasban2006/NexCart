import React from 'react'

import heroimg2 from '../assets/heroimg2.jpg'

import { Link } from 'react-router-dom';
const Hero = () => {
  return (
    <section className='relative w-full overflow-hidden'>
      
        <img src={heroimg2} alt="NexCart" className="w-full h-auto object-cover" />
        <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
          <div className='text-center text-white p-6'>
            <h1 className='text-6xl md:text-9xl font-bold mb-4 tracking-tighter uppercase drop-shadow-xl'>Vacation
            <br />
            Ready
            </h1>
          <p className='text-sm md:text-lg mb-6 tracking-wide uppercase font-medium drop-shadow-lg'>
            Your Ultimate Online Shopping Destination
          </p>
          <Link to="/collections" className='inline-block bg-amber-50 text-xl md:text-2xl font-semibold text-black px-8 py-3 rounded shadow-lg hover:bg-amber-600 hover:text-white hover:scale-105 transition-all duration-300'>
            Shop Now
          </Link>
          </div>
          

        </div>
      
    </section>
  )
}

export default Hero