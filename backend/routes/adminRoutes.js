import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getOutdatedProperties,
  getStats,
  deleteOutdatedProperties,
  getAllUsers
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/pending-properties', getPendingProperties);
router.put('/approve-property/:id', approveProperty);
router.put('/reject-property/:id', rejectProperty);
router.get('/outdated-properties', getOutdatedProperties);
router.delete('/delete-outdated', deleteOutdatedProperties);
router.get('/users', getAllUsers);

export default router;