import express from 'express';
const router = express.Router();

// GET /api/orders
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Orders route is working!',
        data: []
    });
});

export default router;