// routes/productRoutes.js
import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    searchProducts,
    getFeaturedProducts,
    getTrendingProducts,
    addProductReview
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/search/:keyword', searchProducts);
router.get('/:id', getProductById);

// Protected routes
router.post('/:id/reviews', protect, addProductReview);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;