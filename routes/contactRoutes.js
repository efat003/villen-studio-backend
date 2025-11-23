import express from 'express';
const router = express.Router();

// GET /api/contact
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Contact route is working!',
        data: []
    });
});

// POST /api/contact
router.post('/', (req, res) => {
    res.json({
        success: true,
        message: 'Contact form submitted successfully!',
        data: req.body
    });
});

export default router;