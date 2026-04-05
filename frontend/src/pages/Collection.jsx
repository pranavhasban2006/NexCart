import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';

const Collection = () => {
  const { collection } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, searchParams, collection]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === 'color' || key === 'size' || key === 'material' || key === 'brand') {
      const currentValues = newParams.get(key) ? newParams.get(key).split(',') : [];
      if (currentValues.includes(value)) {
        const updatedValues = currentValues.filter(v => v !== value);
        if (updatedValues.length > 0) newParams.set(key, updatedValues.join(','));
        else newParams.delete(key);
      } else {
        newParams.set(key, [...currentValues, value].join(','));
      }
    } else if (newParams.get(key) === value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const colors = ['Red', 'Blue', 'Black', 'Green', 'Yellow', 'Gray', 'White', 'Pink', 'Orange'];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-8 flex flex-col md:flex-row gap-10">
      {/* Mobile filter button */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tighter">FILTERS</h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md text-sm font-medium border border-gray-200"
        >
          {isSidebarOpen ? 'Close' : 'View Filters'}
        </button>
      </div>

      {/* Left Sidebar Filter */}
      <div 
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-6 shadow-xl transition-transform duration-300 md:static md:translate-x-0 md:bg-transparent md:p-0 md:shadow-none md:w-1/4 xl:w-1/5 2xl:w-1/6 pr-8 flex-col gap-6 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full overflow-y-auto md:overflow-visible">
          <h2 className="text-xl font-semibold mb-6 flex items-center justify-between border-b border-gray-100 pb-2 uppercase tracking-tighter">
            Filter 
            <button 
              onClick={clearFilters} 
              className="text-gray-400 hover:text-red-500 border border-gray-200 px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all hover:bg-gray-50 hover:border-red-200"
            >
              Clear All
            </button>
          </h2>

          {/* Category */}
          <div className="mb-6 border-b border-gray-100 pb-4">
            <h3 className="font-medium mb-3 text-gray-800">Category</h3>
            <div className="space-y-2">
              {['Top Wear', 'Bottom Wear'].map(cat => (
                <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="category"
                    checked={queryParams.category === cat}
                    onChange={() => handleFilterChange('category', cat)}
                    className="form-radio text-black focus:ring-black h-4 w-4 border-gray-300" 
                  />
                  <span className={`text-sm ${queryParams.category === cat ? 'text-black font-semibold' : 'text-gray-600'}`}>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="mb-6 border-b border-gray-100 pb-4">
            <h3 className="font-medium mb-3 text-gray-800">Gender</h3>
            <div className="space-y-2">
              {['Men', 'Women'].map(gen => (
                <label key={gen} className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="gender" 
                    checked={queryParams.gender === gen}
                    onChange={() => handleFilterChange('gender', gen)}
                    className="form-radio text-black focus:ring-black h-4 w-4 border-gray-300" 
                  />
                  <span className={`text-sm ${queryParams.gender === gen ? 'text-black font-semibold' : 'text-gray-600'}`}>{gen}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mb-6 border-b border-gray-100 pb-4">
            <h3 className="font-medium mb-3 text-gray-800">Color</h3>
            <div className="flex flex-wrap gap-3">
              {colors.map((color, index) => {
                const isSelected = queryParams.color?.split(',').includes(color);
                return (
                  <button 
                    key={index}
                    onClick={() => handleFilterChange('color', color)}
                    style={{ backgroundColor: color.toLowerCase() }}
                    className={`w-7 h-7 rounded-full border border-gray-200 transition-all ${isSelected ? 'ring-2 ring-black ring-offset-2' : 'hover:scale-110'}`}
                    aria-label={`Select ${color}`}
                  ></button>
                )
              })}
            </div>
          </div>

          {/* Size */}
          <div className="mb-6 border-b border-gray-100 pb-4">
            <h3 className="font-medium mb-3 text-gray-800">Size</h3>
            <div className="space-y-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <label key={size} className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={queryParams.size ? queryParams.size.split(',').includes(size) : false}
                    onChange={() => handleFilterChange('size', size)}
                    className="form-checkbox text-black rounded-sm focus:ring-black h-4 w-4 border-gray-300" 
                  />
                  <span className="text-gray-600 text-sm">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Material */}
          <div className="mb-6 border-b border-gray-100 pb-4">
            <h3 className="font-medium mb-3 text-gray-800">Material</h3>
            <div className="space-y-2">
              {['Cotton', 'Wool', 'Denim', 'Polyester', 'Silk', 'Linen', 'Viscose', 'Fleece'].map(material => (
                <label key={material} className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={queryParams.material ? queryParams.material.split(',').includes(material) : false}
                    onChange={() => handleFilterChange('material', material)}
                    className="form-checkbox text-black rounded-sm focus:ring-black h-4 w-4 border-gray-300" 
                  />
                  <span className="text-gray-600 text-sm">{material}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="mb-6 border-b border-gray-100 pb-4">
            <h3 className="font-medium mb-3 text-gray-800">Brand</h3>
            <div className="space-y-2">
              {['Urban Threads', 'Modern Fit', 'Street Style', 'Beach Breeze', 'Fashionista', 'ChicStyle'].map(brand => (
                <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={queryParams.brand ? queryParams.brand.split(',').includes(brand) : false}
                    onChange={() => handleFilterChange('brand', brand)}
                    className="form-checkbox text-black rounded-sm focus:ring-black h-4 w-4 border-gray-300" 
                  />
                  <span className="text-gray-600 text-sm">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-800 flex justify-between">
              Price Range
              <span className="text-sm font-bold text-gray-900">${queryParams.maxPrice || 100}</span>
            </h3>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={queryParams.maxPrice || 100}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" 
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>$0</span>
              <span>$100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-3/4 xl:w-4/5 2xl:w-5/6">
        {/* Top Header */}
        <div className="hidden md:flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-800 uppercase tracking-wide">
            {queryParams.gender ? `${queryParams.gender}'S COLLECTION` : 'ALL COLLECTION'} 
            <span className="text-sm text-gray-400 ml-3">({products.length} items)</span>
          </h1>
          <div className="flex items-center">
            <select 
              value={queryParams.sortBy || 'Default'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value === 'Default' ? '' : e.target.value)}
              className="border border-gray-200 text-gray-600 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-gray-400 bg-white shadow-sm cursor-pointer"
            >
              <option value="Default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popularity">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
            <div className="flex justify-center items-center p-20 text-gray-500">
                <p className="text-lg">Loading products...</p>
            </div>
        ) : error ? (
            <div className="flex justify-center items-center p-20 text-red-500 font-bold">
                <p className="text-lg">Error: {error}</p>
            </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-gray-500">
             <p className="text-lg font-medium">No products match your filters.</p>
             <button onClick={clearFilters} className="mt-4 text-blue-500 hover:underline font-bold">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
            {products.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`} className="group cursor-pointer block">
                <div className="w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-4 relative shadow-sm hover:shadow-md transition-shadow duration-300">
                  <img 
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/150'} 
                    alt={product.images?.[0]?.altText || product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 truncate mb-1 uppercase tracking-tighter">{product.name}</h3>
                  <p className="text-sm text-gray-500 font-bold">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
