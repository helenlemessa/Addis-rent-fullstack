import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTrash, FaPlus } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import PhoneInput from '../components/PhoneInput';
import { validateEthiopianPhone } from '../utils/phoneValidation';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [property, setProperty] = useState(null);
  const [phoneError, setPhoneError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    contactPhone: '',
    amenities: []
  });
  const [amenityInput, setAmenityInput] = useState('');

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`${API_URL}/properties/${id}`);
      const propertyData = response.data.property;
      setProperty(propertyData);
      
      setFormData({
        title: propertyData.title,
        description: propertyData.description,
        price: propertyData.price,
        location: propertyData.location,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        area: propertyData.area,
        contactPhone: propertyData.contactPhone || '',
        amenities: propertyData.amenities || []
      });
    } catch (error) {
      console.error('Fetch property error:', error);
      toast.error('Property not found');
      navigate('/my-properties');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (phone) => {
    setFormData({ ...formData, contactPhone: phone });
    const validation = validateEthiopianPhone(phone);
    if (phone && !validation.valid) {
      setPhoneError(validation.message);
    } else {
      setPhoneError('');
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityInput.trim()]
      });
      setAmenityInput('');
    }
  };

  const removeAmenity = (amenity) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter(a => a !== amenity)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number before submission
    const phoneValidation = validateEthiopianPhone(formData.contactPhone);
    if (!phoneValidation.valid) {
      toast.error(phoneValidation.message);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.put(`${API_URL}/properties/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      toast.success(response.data.message || 'Property updated successfully');
      navigate('/my-properties');
    } catch (error) {
      console.error('Update property error:', error);
      toast.error(error.response?.data?.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Property</h1>
        
        {/* Warning for editing approved properties */}
        {property && !property.isArchived && property.status === 'approved' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> This property is currently active. After editing, it will be set to 
                  <strong> "Pending Approval"</strong> status and will need to be reviewed by an admin again 
                  before it becomes visible to tenants.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (per month) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms *
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    required
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms *
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    required
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area (sqft) *
                  </label>
                  <input
                    type="number"
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Information with Phone Validation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone Number for This Property *
              </label>
              <PhoneInput
                value={formData.contactPhone}
                onChange={handlePhoneChange}
                required={true}
              />
            </div>
          </div>
          
          {/* Amenities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                className="flex-1 input-field"
                placeholder="e.g., Parking, WiFi, Pool"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/my-properties')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !!phoneError}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;