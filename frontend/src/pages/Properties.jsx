import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SearchFilters from '../components/SearchFilters';
import PropertyCard from '../components/PropertyCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    bedrooms: ''
  });

  // Fetch properties whenever filters change
  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Add filters to params only if they have values
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key].toString().trim() !== '') {
          params.append(key, filters[key]);
        }
      });
      
      console.log('Fetching with params:', params.toString()); // Debug log
      
      const response = await axios.get(`${API_URL}/properties?${params.toString()}`);
      setProperties(response.data.properties);
    } catch (error) {
      console.error('Fetch properties error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    console.log('Filters changed:', newFilters); // Debug log
    setFilters(newFilters);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Properties</h1>
        
        <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
        
        {/* Results Count */}
        {!loading && (
          <div className="mb-4 text-gray-600">
            Found {properties.length} {properties.length === 1 ? 'property' : 'properties'}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg mb-4">No properties found matching your criteria</p>
            <button
              onClick={() => {
                const resetFilters = {
                  search: '',
                  minPrice: '',
                  maxPrice: '',
                  location: '',
                  bedrooms: ''
                };
                setFilters(resetFilters);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;