import express from 'express';
import {
  createHireRequest,
  getHireRequests,
  createBooking,
  getBookings,
  getAvailableSlots,
  getMyBookings,
  submitReview,
  cancelOrder,
} from '../controllers/serviceController.js';
import { protect, admin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes with optional auth (to link bookings to users if logged in)
router.post('/hire', optionalAuth, createHireRequest);
router.post('/book', optionalAuth, createBooking);
router.get('/slots/:date', getAvailableSlots);

// Protected routes
router.get('/my-bookings', protect, getMyBookings);
router.post('/review', protect, submitReview);
router.put('/cancel/:orderId', protect, cancelOrder);

// Admin routes
router.get('/hire', protect, admin, getHireRequests);
router.get('/book', protect, admin, getBookings);

export default router;


