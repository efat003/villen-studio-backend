// controllers/orderController.js
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod,
            notes
        } = req.body;

        // Calculate total amount
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`
                });
            }

            // Check stock availability
            const sizeStock = product.sizes.find(s => s.size === item.size);
            if (!sizeStock || sizeStock.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name.en} - Size: ${item.size}`
                });
            }

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                product: item.product,
                name: {
                    en: product.name.en,
                    bn: product.name.bn
                },
                quantity: item.quantity,
                price: product.price,
                size: item.size,
                color: item.color,
                image: product.images[0]
            });
        }

        // Calculate shipping fee (BDT 60 inside Dhaka, 120 outside)
        const shippingFee = shippingAddress.district.toLowerCase().includes('dhaka') ? 60 : 120;

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            shippingFee,
            finalAmount: totalAmount + shippingFee,
            paymentMethod,
            shippingAddress,
            notes
        });

        await order.populate('user', 'name email phone');
        await order.populate('items.product', 'name images');

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name images')
            .sort('-createdAt');

        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('items.product', 'name images brand');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns the order or is admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, trackingNumber, carrier, estimatedDelivery } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                orderStatus,
                ...(trackingNumber && { trackingNumber }),
                ...(carrier && { carrier }),
                ...(estimatedDelivery && { estimatedDelivery })
            },
            { new: true, runValidators: true }
        ).populate('user', 'name email phone')
         .populate('items.product', 'name images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .populate('user', 'name email phone')
            .populate('items.product', 'name images')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments();

        res.json({
            success: true,
            count: orders.length,
            total,
            pagination: {
                page,
                limit,
                pages: Math.ceil(total / limit)
            },
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$finalAmount' } } }
        ]);
        const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
        const completedOrders = await Order.countDocuments({ orderStatus: 'delivered' });

        // Monthly revenue
        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'completed',
                    createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
                }
            },
            { $group: { _id: null, total: { $sum: '$finalAmount' } } }
        ]);

        res.json({
            success: true,
            stats: {
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                pendingOrders,
                completedOrders,
                monthlyRevenue: monthlyRevenue[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};