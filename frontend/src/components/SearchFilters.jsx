import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const SearchFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Debounce function to delay search while typing
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (localFilters.search && localFilters.search.trim() !== '') count++;
    if (localFilters.minPrice && localFilters.minPrice !== '') count++;
    if (localFilters.maxPrice && localFilters.maxPrice !== '') count++;
    if (localFilters.location && localFilters.location.trim() !== '') count++;
    if (localFilters.bedrooms && localFilters.bedrooms !== '') count++;
    setActiveFiltersCount(count);
  }, [localFilters]);

  // Handle input change and trigger search immediately
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...localFilters, [name]: value };
    setLocalFilters(updatedFilters);
    
    // Trigger search immediately for text inputs
    if (name === 'search' || name === 'location') {
      debouncedSearch(updatedFilters);
    } else {
      // For other filters, trigger immediately
      onFilterChange(updatedFilters);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((updatedFilters) => {
      onFilterChange(updatedFilters);
    }, 500),
    []
  );

  // Handle number inputs with validation
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string or positive numbers
    if (value === '' || (Number(value) >= 0 && !isNaN(value))) {
      const updatedFilters = { ...localFilters, [name]: value };
      setLocalFilters(updatedFilters);
      onFilterChange(updatedFilters);
    }
  };

  // Handle select change
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...localFilters, [name]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Clear a specific filter
  const clearFilter = (filterName) => {
    const updatedFilters = { ...localFilters, [filterName]: '' };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Reset all filters
  const handleReset = () => {
    const resetFilters = {
      search: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      bedrooms: ''
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    setShowFilters(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Main Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="search"
            value={localFilters.search}
            onChange={handleInputChange}
            placeholder="Search by title, description, or location..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {localFilters.search && (
            <button
              onClick={() => clearFilter('search')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            showFilters 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FaFilter />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {localFilters.search && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              Search: {localFilters.search}
              <button onClick={() => clearFilter('search')} className="hover:text-blue-600">
                <FaTimes size={12} />
              </button>
            </span>
          )}
          {localFilters.location && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              Location: {localFilters.location}
              <button onClick={() => clearFilter('location')} className="hover:text-blue-600">
                <FaTimes size={12} />
              </button>
            </span>
          )}
          {localFilters.minPrice && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              Min: ${localFilters.minPrice}
              <button onClick={() => clearFilter('minPrice')} className="hover:text-blue-600">
                <FaTimes size={12} />
              </button>
            </span>
          )}
          {localFilters.maxPrice && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              Max: ${localFilters.maxPrice}
              <button onClick={() => clearFilter('maxPrice')} className="hover:text-blue-600">
                <FaTimes size={12} />
              </button>
            </span>
          )}
          {localFilters.bedrooms && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {localFilters.bedrooms}+ Bedrooms
              <button onClick={() => clearFilter('bedrooms')} className="hover:text-blue-600">
                <FaTimes size={12} />
              </button>
            </span>
          )}
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price (ETB)
            </label>
            <input
              type="number"
              name="minPrice"
              value={localFilters.minPrice}
              onChange={handleNumberChange}
              placeholder="Min Price"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price (ETB)
            </label>
            <input
              type="number"
              name="maxPrice"
              value={localFilters.maxPrice}
              onChange={handleNumberChange}
              placeholder="Max Price"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={localFilters.location}
              onChange={handleInputChange}
              placeholder="City or Area"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bedrooms
            </label>
            <select
              name="bedrooms"
              value={localFilters.bedrooms}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option value="1">1+ Bedroom</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;