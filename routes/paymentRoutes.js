import express from 'express';
const router = express.Router();

// GET /api/payment
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Payment route is working!',
        data: []
    });
});

export default router;