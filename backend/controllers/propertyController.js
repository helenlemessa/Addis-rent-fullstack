import Property from '../models/Property.js';

// @desc    Create property (landowner)
// @route   POST /api/properties
export const createProperty = async (req, res) => {
  try {
    const { title, description, price, location, bedrooms, bathrooms, area, amenities } = req.body;
    
    // Get image URLs from uploaded files
    const images = req.files ? req.files.map(file => file.path) : [];
    
    if (images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }
    
    const property = await Property.create({
      landownerId: req.user._id,
      title,
      description,
      price,
      location,
      bedrooms,
      bathrooms,
      area,
      images,
      amenities: amenities ? JSON.parse(amenities) : [],
      status: 'pending' // Needs admin approval
    });
    
    res.status(201).json({
      success: true,
      property
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all approved properties (tenants)
// @route   GET /api/properties
export const getProperties = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, location, bedrooms } = req.query;
    
    let query = { status: 'approved', isArchived: false };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (bedrooms) query.bedrooms = Number(bedrooms);
    
    const properties = await Property.find(query)
      .populate('landownerId', 'name email phone')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 // @desc    Update property (landowner)
// @route   PUT /api/properties/:id

export const unarchiveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Check ownership
    if (property.landownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Check if property was approved before archiving
    if (property.status === 'archived') {
      property.isArchived = false;
      property.status = 'approved'; // Restore to approved status
      await property.save();
      
      return res.json({
        success: true,
        message: 'Property restored successfully',
        property
      });
    }
    
    res.status(400).json({ message: 'Property is not archived' });
  } catch (error) {
    console.error('Unarchive property error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// @desc    Get single property
// @route   GET /api/properties/:id
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landownerId', 'name email phone');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json({
      success: true,
      property
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get landowner's properties
// @route   GET /api/properties/my-properties
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ landownerId: req.user._id })
      .sort('-createdAt');
    
    res.json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Get my properties error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update property (landowner)
// @route   PUT /api/properties/:id
export const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Check ownership
    if (property.landownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Only allow updates if property is not approved yet or is archived
    if (property.status === 'approved' && !property.isArchived) {
      return res.status(400).json({ message: 'Approved properties cannot be edited. Please archive and create a new one.' });
    }
    
    property = await Property.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      property
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Archive property (landowner)
// @route   PUT /api/properties/:id/archive
export const archiveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Check ownership
    if (property.landownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    property.isArchived = true;
    property.status = 'archived';
    await property.save();
    
    res.json({
      success: true,
      message: 'Property archived successfully',
      property
    });
  } catch (error) {
    console.error('Archive property error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete property (landowner or admin)
// @route   DELETE /api/properties/:id
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Check ownership or admin
    if (property.landownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await property.deleteOne();
    
    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};