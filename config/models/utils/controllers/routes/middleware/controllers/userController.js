// controllers/userController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, phone, language } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            language: language || 'en'
        });

        if (user) {
            user.lastLogin = Date.now();
            await user.save();

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    language: user.language,
                    avatar: user.avatar
                },
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check if user exists and password is correct
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.comparePassword(password))) {
            user.lastLogin = Date.now();
            await user.save();

            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    language: user.language,
                    avatar: user.avatar
                },
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('wishlist')
            .populate('orders');

        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
export const addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const productId = req.params.productId;

        if (user.wishlist.includes(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Product already in wishlist'
            });
        }

        user.wishlist.push(productId);
        await user.save();

        await user.populate('wishlist');

        res.json({
            success: true,
            message: 'Product added to wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const productId = req.params.productId;

        user.wishlist = user.wishlist.filter(
            item => item.toString() !== productId
        );

        await user.save();
        await user.populate('wishlist');

        res.json({
            success: true,
            message: 'Product removed from wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');

        res.json({
            success: true,
            wishlist: user.wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};