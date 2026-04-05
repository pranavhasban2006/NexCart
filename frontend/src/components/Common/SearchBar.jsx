import React from 'react'
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleSearchToggle = () => {
        setIsOpen(!isOpen);
    }
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/collections?search=${encodeURIComponent(searchTerm.trim())}`);
        }
        setIsOpen(false);
    }

    return (
        <div className={`flex items-center justify-center w-full transition-all duration-300 space-x-2 ${isOpen ? 'absolute top-0 left-0 bg-amber-50 h-24 z-50' : 'w-auto'}`}>

            {isOpen ? (
                <form 
                onSubmit={handleSearch}
                className='relative flex items-center justify-center w-full'>
                    
                    <div className='relative w-1/2'>
                        
                        <input
                            type="text"
                            placeholder='Search...'
                            className='w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <button
                            type="submit"
                            className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800'
                        >
                            <HiMagnifyingGlass className='h-5 w-5 text-gray-700 hover:text-[#9caebb]' />
                        </button>

                    </div>
                {/* Close button */}
                    <button type="button"onClick={handleSearchToggle} className='text-gray-600 hover:text-gray-800 absolute right-4 top-1/2 transform -translate-y-1/'>
                         <HiMiniXMark className='h-5 w-5 text-gray-700 hover:text-[#9caebb]' />
                         </button>
                </form>
            ) : (
                <button onClick={handleSearchToggle} className='text-gray-600 hover:text-gray-800'>
                    <HiMagnifyingGlass className='h-5 w-5 text-gray-700 hover:text-[#9caebb]' />
                </button>
            )}

        </div>
    )
}

export default SearchBar
