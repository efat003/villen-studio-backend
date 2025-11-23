// routes/paymentRoutes.js
import express from 'express';
import {
    createBkashPayment,
    bkashCallback,
    createNagadPayment,
    verifyPayment
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// bKash routes
router.post('/bkash/create', protect, createBkashPayment);
router.post('/bkash/callback', bkashCallback);

// Nagad routes
router.post('/nagad/create', protect, createNagadPayment);

// Common routes
router.get('/verify/:orderId', protect, verifyPayment);

export default router;