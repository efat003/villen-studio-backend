import express from 'express';
const router = express.Router();

// GET /api/users
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Users route is working!',
        data: []
    });
});

export default router;