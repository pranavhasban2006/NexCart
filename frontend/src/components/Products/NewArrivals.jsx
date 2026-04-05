import React, { useState, useRef, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import axios from 'axios'

const NewArrivals = () => {
    const scrollContainerRef = useRef(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    // Slice products to serve as New Arrivals
    const [newArrivals,setNewArrivals]=useState([]);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
            setCanScrollLeft(scrollLeft > 0)
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

        useEffect(()=>{
            const fetchNewArrivals=async()=>{
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/new-arrivals`);
                setNewArrivals(response.data);
            }
            fetchNewArrivals();
        },[]);
    useEffect(() => {
        checkScroll()
        const container = scrollContainerRef.current
        if (container) {
            container.addEventListener('scroll', checkScroll)
            return () => container.removeEventListener('scroll', checkScroll)
        }
    }, [newArrivals])

    const scroll = (direction) => {
        const container = scrollContainerRef.current
        if (!container) return

        const scrollAmount = 300
        if (direction === 'Left') {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
        } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }

        // Update button states after scroll
        setTimeout(checkScroll, 300)
    }

    return (
        <>
            <section>
                <div className='relative w-full px-4 sm:px-6 lg:px-12 xl:px-16 mx-auto text-center mb-10'>
                    <h2 className='text-3xl font-bold mb-4'>New Arrivals</h2>
                    <p className='text-gray-600 mb-8'>Discover the latest trends in fashion with our new arrivals collection.</p>

                    {/* Scroll buttons aligned with internal padding */}
                    <div className='absolute right-4 sm:right-6 lg:right-12 xl:right-16 bottom-[-30px] z-10 flex space-x-2'>
                        <button
                            onClick={() => scroll('Left')}
                            disabled={!canScrollLeft}
                            className={`bg-gray-300 text-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-400 transition duration-300 ${canScrollLeft ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                                }`}
                            aria-label="Scroll left"
                        >
                            <FiChevronLeft className='h-5 w-5' />
                        </button>
                        <button
                            onClick={() => scroll('Right')}
                            disabled={!canScrollRight}
                            className={`bg-gray-300 text-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-400 transition duration-300 ${canScrollRight ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                                }`}
                            aria-label="Scroll right"
                        >
                            <FiChevronRight className='h-5 w-5' />
                        </button>
                    </div>
                </div>

                {/* Scrollable content */}
                <div
                    ref={scrollContainerRef}
                    className='w-full px-4 sm:px-6 lg:px-12 xl:px-16 mx-auto overflow-x-auto scroll-smooth hide-scrollbar'
                >
                    <div className='flex space-x-6 h-auto'>
                        {newArrivals.map((product) => (
                            <Link key={product._id} to={`/product/${product._id}`} className='min-w-[200px] shrink-0 rounded-lg shadow-md relative overflow-hidden block'>
                                <img src={product.images?.[0]?.url || ''} alt={product.name} className='w-full h-[250px] object-cover mb-4' />
                                <div className='absolute bottom-0 left-0 w-full bg-transparent'>
                                    <h3 className='text-sm font-bold text-white'>{product.name}</h3>
                                    <p className='text-sm font-bold text-white'>${product.price?.toFixed(2)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default NewArrivals