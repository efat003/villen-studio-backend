// controllers/paymentController.js
import Order from '../models/Order.js';
import bkashService from '../services/bkashService.js';
import nagadService from '../services/nagadService.js';

// @desc    Initiate bKash payment
// @route   POST /api/payment/bkash/create
// @access  Private
export const createBkashPayment = async (req, res) => {
    try {
        const { orderId, amount } = req.body;

        const order = await Order.findOne({ orderId, user: req.user._id });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const callbackURL = `${req.protocol}://${req.get('host')}/api/payment/bkash/callback`;
        const payment = await bkashService.createPayment(amount, orderId, callbackURL);

        res.json({
            success: true,
            ...payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    bKash payment callback
// @route   POST /api/payment/bkash/callback
// @access  Public
export const bkashCallback = async (req, res) => {
    try {
        const { paymentID, status, orderID } = req.body;

        if (status === 'success') {
            const result = await bkashService.executePayment(paymentID);
            
            if (result.transactionStatus === 'Completed') {
                // Update order status
                await Order.findOneAndUpdate(
                    { orderId: orderID },
                    {
                        paymentStatus: 'completed',
                        transactionId: result.trxID,
                        paidAmount: parseFloat(result.amount),
                        orderStatus: 'confirmed'
                    }
                );

                return res.redirect(`${process.env.FRONTEND_URL}/payment/success?orderId=${orderID}`);
            }
        }

        // Payment failed
        await Order.findOneAndUpdate(
            { orderId: orderID },
            { 
                paymentStatus: 'failed',
                orderStatus: 'cancelled'
            }
        );

        res.redirect(`${process.env.FRONTEND_URL}/payment/failed?orderId=${orderID}`);
    } catch (error) {
        console.error('bKash callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/payment/error`);
    }
};

// @desc    Initiate Nagad payment
// @route   POST /api/payment/nagad/create
// @access  Private
export const createNagadPayment = async (req, res) => {
    try {
        const { orderId, amount } = req.body;

        const order = await Order.findOne({ orderId, user: req.user._id });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const callbackURL = `${req.protocol}://${req.get('host')}/api/payment/nagad/callback`;
        const payment = await nagadService.createPayment(amount, orderId, callbackURL);

        res.json({
            success: true,
            ...payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Verify payment status
// @route   GET /api/payment/verify/:orderId
// @access  Private
export const verifyPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ orderId, user: req.user._id });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            paymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};