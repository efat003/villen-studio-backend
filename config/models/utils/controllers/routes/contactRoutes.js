// routes/contactRoutes.js
import express from 'express';
import {
    sendContactMessage,
    subscribeNewsletter
} from '../controllers/contactController.js';

const router = express.Router();

router.post('/', sendContactMessage);
router.post('/subscribe', subscribeNewsletter);

export default router;