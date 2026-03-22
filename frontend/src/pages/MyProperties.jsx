import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEdit, FaArchive, FaTrash, FaEye, FaPlus, FaUndo } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'archived', 'pending'

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}/properties/my-properties`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProperties(response.data.properties);
    } catch (error) {
      console.error('Fetch properties error:', error);
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (propertyId) => {
    try {
      await axios.put(`${API_URL}/properties/${propertyId}/archive`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Property archived successfully');
      fetchProperties();
    } catch (error) {
      console.error('Archive error:', error);
      toast.error(error.response?.data?.message || 'Failed to archive property');
    }
  };

  const handleUnarchive = async (propertyId) => {
    try {
      await axios.put(`${API_URL}/properties/${propertyId}/unarchive`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Property restored successfully! It will be visible to tenants again.');
      fetchProperties();
    } catch (error) {
      console.error('Unarchive error:', error);
      toast.error(error.response?.data?.message || 'Failed to restore property');
    }
  };

  const handleDelete = async () => {
    if (!selectedProperty) return;
    
    try {
      await axios.delete(`${API_URL}/properties/${selectedProperty._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Property deleted successfully');
      setShowDeleteModal(false);
      fetchProperties();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete property');
    }
  };

  const getStatusBadge = (status, isArchived) => {
    if (isArchived) {
      return 'bg-gray-100 text-gray-800';
    }
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status, isArchived) => {
    if (isArchived) return 'Archived';
    const texts = {
      pending: 'Pending Approval',
      approved: 'Active',
      rejected: 'Rejected'
    };
    return texts[status] || status;
  };

  const getFilteredProperties = () => {
    if (filter === 'active') {
      return properties.filter(p => !p.isArchived && p.status === 'approved');
    }
    if (filter === 'pending') {
      return properties.filter(p => !p.isArchived && p.status === 'pending');
    }
    if (filter === 'archived') {
      return properties.filter(p => p.isArchived);
    }
    return properties;
  };

  const filteredProperties = getFilteredProperties();

  if (loading) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          <Link
            to="/create-property"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" /> Post New Property
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setFilter('all')}
              className={`py-2 px-1 border-b-2 transition-colors ${
                filter === 'all' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All ({properties.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`py-2 px-1 border-b-2 transition-colors ${
                filter === 'active' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active ({properties.filter(p => !p.isArchived && p.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`py-2 px-1 border-b-2 transition-colors ${
                filter === 'pending' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending ({properties.filter(p => !p.isArchived && p.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('archived')}
              className={`py-2 px-1 border-b-2 transition-colors ${
                filter === 'archived' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Archived ({properties.filter(p => p.isArchived).length})
            </button>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg mb-4">
              {filter === 'all' ? "You haven't posted any properties yet" :
               filter === 'active' ? "No active properties" :
               filter === 'pending' ? "No properties pending approval" :
               "No archived properties"}
            </p>
            {filter === 'all' && (
              <Link to="/create-property" className="btn-primary inline-block">
                Post Your First Property
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posted Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.map((property) => (
                    <tr key={property._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded object-cover"
                              src={property.images[0]}
                              alt={property.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {property.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {property.bedrooms} beds • {property.bathrooms} baths • {property.area} sqft
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${property.price.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">/month</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(property.status, property.isArchived)}`}>
                          {getStatusText(property.status, property.isArchived)}
                        </span>
                        {/* Show notification if property needs re-approval */}
                        {property.status === 'pending' && !property.isArchived && property.createdAt !== property.updatedAt && (
                          <p className="text-xs text-yellow-600 mt-1">
                            Updated - awaiting approval
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(property.createdAt).toLocaleDateString()}
                        {property.updatedAt !== property.createdAt && (
                          <p className="text-xs text-gray-400">
                            Updated: {new Date(property.updatedAt).toLocaleDateString()}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/properties/${property._id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                          >
                            <FaEye />
                          </Link>
                          
                          {/* Show edit button for all non-archived properties */}
                          {!property.isArchived && (
                            <Link
                              to={`/edit-property/${property._id}`}
                              className={`${
                                property.status === 'approved' 
                                  ? 'text-orange-600 hover:text-orange-900' 
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                              title={property.status === 'approved' ? 'Edit (will require re-approval)' : 'Edit'}
                            >
                              <FaEdit />
                            </Link>
                          )}
                          
                          {/* Show archive button for active properties */}
                          {property.status === 'approved' && !property.isArchived && (
                            <button
                              onClick={() => handleArchive(property._id)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Archive"
                            >
                              <FaArchive />
                            </button>
                          )}
                          
                          {/* Show unarchive button for archived properties */}
                          {property.isArchived && (
                            <button
                              onClick={() => handleUnarchive(property._id)}
                              className="text-green-600 hover:text-green-900"
                              title="Restore from Archive"
                            >
                              <FaUndo />
                            </button>
                          )}
                          
                          <button
                            onClick={() => {
                              setSelectedProperty(property);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Property</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedProperty?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProperties;