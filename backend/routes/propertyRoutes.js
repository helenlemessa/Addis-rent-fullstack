import express from 'express';
import { protect, landownerOnly } from '../middleware/auth.js';
import { uploadImages } from '../middleware/upload.js';
import {
  createProperty,
  getProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  archiveProperty,
  deleteProperty,
  unarchiveProperty
} from '../controllers/propertyController.js';

const router = express.Router();

router.get('/', getProperties);
router.get('/my-properties', protect, landownerOnly, getMyProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, landownerOnly, uploadImages, createProperty);
router.put('/:id', protect, landownerOnly, updateProperty);
router.put('/:id/archive', protect, landownerOnly, archiveProperty);
router.delete('/:id', protect, deleteProperty);
 
router.put('/:id/unarchive', protect, landownerOnly, unarchiveProperty);
export default router;