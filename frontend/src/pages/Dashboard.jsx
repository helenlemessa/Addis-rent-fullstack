import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaHome, FaBuilding, FaUser, FaPlus, FaEye, FaChartLine } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user, isLandowner, isAdmin } = useAuth();
  const [myProperties, setMyProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (isLandowner) {
        const propertiesRes = await axios.get(`${API_URL}/properties/my-properties`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMyProperties(propertiesRes.data.properties);
      }
      
      // Fetch stats if needed
      setLoading(false);
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      setLoading(false);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your account</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Account Type</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">{user?.role}</p>
              </div>
              <FaUser className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          {isLandowner && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{myProperties.length}</p>
                  </div>
                  <FaHome className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Active Properties</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {myProperties.filter(p => p.status === 'approved' && !p.isArchived).length}
                    </p>
                  </div>
                  <FaBuilding className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLandowner && (
              <>
                <Link
                  to="/create-property"
                  className="bg-blue-600 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="inline-block mr-2" />
                  Post New Property
                </Link>
                <Link
                  to="/my-properties"
                  className="bg-green-600 text-white rounded-lg p-4 text-center hover:bg-green-700 transition-colors"
                >
                  <FaEye className="inline-block mr-2" />
                  View My Properties
                </Link>
              </>
            )}
            <Link
              to="/properties"
              className="bg-purple-600 text-white rounded-lg p-4 text-center hover:bg-purple-700 transition-colors"
            >
              <FaBuilding className="inline-block mr-2" />
              Browse Properties
            </Link>
          </div>
        </div>

        {/* Recent Properties */}
        {isLandowner && myProperties.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myProperties.slice(0, 3).map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
            {myProperties.length > 3 && (
              <div className="text-center mt-4">
                <Link to="/my-properties" className="text-blue-600 hover:text-blue-800">
                  View all properties →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;