import Property from '../models/Property.js';
import User from '../models/User.js';

// @desc    Get pending properties
// @route   GET /api/admin/pending-properties
export const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'pending' })
      .populate('landownerId', 'name email phone')
      .sort('-createdAt');
    
    res.json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Get pending properties error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Approve property
// @route   PUT /api/admin/approve-property/:id
export const approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    property.status = 'approved';
    property.isArchived = false;
    await property.save();
    
    res.json({
      success: true,
      message: 'Property approved successfully',
      property
    });
  } catch (error) {
    console.error('Approve property error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reject property
// @route   PUT /api/admin/reject-property/:id
export const rejectProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    property.status = 'rejected';
    await property.save();
    
    res.json({
      success: true,
      message: 'Property rejected',
      property
    });
  } catch (error) {
    console.error('Reject property error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get outdated properties (>1 month)
// @route   GET /api/admin/outdated-properties
export const getOutdatedProperties = async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const properties = await Property.find({
      status: 'approved',
      createdAt: { $lt: oneMonthAgo },
      isArchived: false
    }).populate('landownerId', 'name email');
    
    res.json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    console.error('Get outdated properties error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const totalTenants = await User.countDocuments({ role: 'tenant' });
    const totalLandowners = await User.countDocuments({ role: 'landowner' });
    const totalProperties = await Property.countDocuments();
    const approvedProperties = await Property.countDocuments({ status: 'approved' });
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const outdatedProperties = await Property.countDocuments({
      status: 'approved',
      createdAt: { $lt: oneMonthAgo },
      isArchived: false
    });
    
    res.json({
      success: true,
      stats: {
        totalTenants,
        totalLandowners,
        totalProperties,
        approvedProperties,
        pendingProperties,
        outdatedProperties
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete outdated properties
// @route   DELETE /api/admin/delete-outdated
export const deleteOutdatedProperties = async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const result = await Property.deleteMany({
      status: 'approved',
      createdAt: { $lt: oneMonthAgo },
      isArchived: false
    });
    
    res.json({
      success: true,
      message: `${result.deletedCount} outdated properties deleted`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete outdated properties error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};