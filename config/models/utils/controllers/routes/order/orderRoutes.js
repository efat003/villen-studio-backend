// routes/orderRoutes.js
import express from 'express';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
    getOrderStats
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.get('/stats', protect, admin, getOrderStats);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;