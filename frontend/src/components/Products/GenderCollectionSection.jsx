import React from 'react'
import male1 from '../../assets/male1.jpg'
import finalfemale from '../../assets/finalfemale.jpg'
import { Link } from 'react-router-dom' 
const GenderCollectionSection = () => {
  return (
    <section className='py-12 bg-gray-100'>
        <div className='w-full px-4 sm:px-6 lg:px-12 xl:px-16 mx-auto flex flex-col md:flex-row gap-8 items-center'>
            {/* womenscollection */}
            <div className='flex-1 relative'>
                <img src={finalfemale} alt="Womens Collection" className='w-full h-full hover:border-2 hover:border-gray-400 hover:scale-101' />
                <div className='text-4xl absolute bottom-8 left-8 bg-white bg-opacity-90 p-4'>

                <h2 className='text-2xl font-bold text-gray-900 mb-3'>Women's Collection</h2>
                <Link to="/collection/all?gender=Women" className='text-gray-900 underline'>
                shop now
                </Link>
                </div>
            </div>
            {/* mens collection */}
            <div className='flex-1 relative'>
                <img src={male1} alt="Mens Collection" className='w-full h-full hover:border-2 hover:border-gray-400 hover:scale-101' />
                <div className='text-4xl absolute bottom-8 left-8 bg-white bg-opacity-90 p-4'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-3'>Men's Collection</h2>
                    <Link to="/collection/all?gender=Men" className='text-gray-900 underline'>
                        shop now
                    </Link>
                </div>
            </div>

                    </div>
    </section>
  )
}

export default GenderCollectionSection