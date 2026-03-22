import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaUsers, FaHome, FaClock, FaTrash, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [outdatedProperties, setOutdatedProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes, pendingRes, outdatedRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/pending-properties`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/outdated-properties`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setStats(statsRes.data.stats);
      setPendingProperties(pendingRes.data.properties);
      setOutdatedProperties(outdatedRes.data.properties);
      setUsers(usersRes.data.users);
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProperty = async (propertyId) => {
    try {
      await axios.put(`${API_URL}/admin/approve-property/${propertyId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Property approved successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Failed to approve property');
    }
  };

  const handleRejectProperty = async (propertyId) => {
    try {
      await axios.put(`${API_URL}/admin/reject-property/${propertyId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Property rejected');
      fetchDashboardData();
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Failed to reject property');
    }
  };

  const handleDeleteOutdated = async () => {
    if (!confirm('Are you sure you want to delete all outdated properties?')) return;
    
    try {
      await axios.delete(`${API_URL}/admin/delete-outdated`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Outdated properties deleted');
      fetchDashboardData();
    } catch (error) {
      console.error('Delete outdated error:', error);
      toast.error('Failed to delete outdated properties');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await axios.delete(`${API_URL}/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Property deleted');
      fetchDashboardData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete property');
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'pending', 'outdated', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Tenants</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalTenants}</p>
                  </div>
                  <FaUsers className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Landowners</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalLandowners}</p>
                  </div>
                  <FaUsers className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Properties</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
                  </div>
                  <FaHome className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Pending Approval</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingProperties}</p>
                  </div>
                  <FaClock className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Quick Stats</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Approved Properties:</span>
                  <span className="font-semibold">{stats.approvedProperties}</span>
                </div>
                <div className="flex justify-between">
                  <span>Outdated Properties:</span>
                  <span className="font-semibold text-red-600">{stats.outdatedProperties}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Properties Tab */}
        {activeTab === 'pending' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Properties</h2>
            {pendingProperties.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No pending properties</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingProperties.map((property) => (
                  <div key={property._id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{property.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                        <p className="text-blue-600 font-bold">${property.price}/month</p>
                        <p className="text-sm text-gray-500">
                          Posted by: {property.landownerId.name} ({property.landownerId.email})
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/properties/${property._id}`}
                          className="text-blue-600 hover:text-blue-800 p-2"
                          title="View"
                        >
                          <FaEye size={20} />
                        </Link>
                        <button
                          onClick={() => handleApproveProperty(property._id)}
                          className="text-green-600 hover:text-green-800 p-2"
                          title="Approve"
                        >
                          <FaCheck size={20} />
                        </button>
                        <button
                          onClick={() => handleRejectProperty(property._id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Reject"
                        >
                          <FaTimes size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Outdated Properties Tab */}
        {activeTab === 'outdated' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Outdated Properties (1+ month)</h2>
              {outdatedProperties.length > 0 && (
                <button
                  onClick={handleDeleteOutdated}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
                >
                  <FaTrash className="mr-2" /> Delete All
                </button>
              )}
            </div>
            
            {outdatedProperties.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No outdated properties</p>
              </div>
            ) : (
              <div className="space-y-4">
                {outdatedProperties.map((property) => (
                  <div key={property._id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{property.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                        <p className="text-blue-600 font-bold">${property.price}/month</p>
                        <p className="text-sm text-gray-500">
                          Posted: {new Date(property.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/properties/${property._id}`}
                          className="text-blue-600 hover:text-blue-800 p-2"
                          title="View"
                        >
                          <FaEye size={20} />
                        </Link>
                        <button
                          onClick={() => handleDeleteProperty(property._id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Delete"
                        >
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">All Users</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'landowner' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;