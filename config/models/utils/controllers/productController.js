// controllers/productController.js
import Product from '../models/Product.js';
import APIFeatures from '../utils/apiFeatures.js';

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
    try {
        const features = new APIFeatures(Product.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const products = await features.query.populate('reviews.user', 'name avatar');
        const total = await Product.countDocuments();

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            pagination: {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 12,
                pages: Math.ceil(total / (parseInt(req.query.limit) || 12))
            },
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('reviews.user', 'name avatar')
            .populate('category');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { 
                new: true, 
                runValidators: true 
            }
        ).populate('reviews.user', 'name avatar');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const products = await Product.find({ 
            category: category.toLowerCase(),
            isActive: true 
        })
        .populate('reviews.user', 'name avatar')
        .skip(skip)
        .limit(limit)
        .sort('-createdAt');

        const total = await Product.countDocuments({ 
            category: category.toLowerCase(),
            isActive: true 
        });

        res.status(200).json({
            success: true,
            category,
            count: products.length,
            total,
            pagination: {
                page,
                limit,
                pages: Math.ceil(total / limit)
            },
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Search products
// @route   GET /api/products/search/:keyword
// @access  Public
export const searchProducts = async (req, res) => {
    try {
        const { keyword } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const searchRegex = new RegExp(keyword, 'i');

        const products = await Product.find({
            $or: [
                { 'name.en': searchRegex },
                { 'name.bn': searchRegex },
                { 'description.en': searchRegex },
                { 'description.bn': searchRegex },
                { brand: searchRegex },
                { tags: searchRegex },
                { category: searchRegex },
                { subcategory: searchRegex }
            ],
            isActive: true
        })
        .populate('reviews.user', 'name avatar')
        .skip(skip)
        .limit(limit)
        .sort('-createdAt');

        const total = await Product.countDocuments({
            $or: [
                { 'name.en': searchRegex },
                { 'name.bn': searchRegex },
                { 'description.en': searchRegex },
                { 'description.bn': searchRegex },
                { brand: searchRegex },
                { tags: searchRegex },
                { category: searchRegex },
                { subcategory: searchRegex }
            ],
            isActive: true
        });

        res.status(200).json({
            success: true,
            keyword,
            count: products.length,
            total,
            pagination: {
                page,
                limit,
                pages: Math.ceil(total / limit)
            },
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ 
            featured: true,
            isActive: true 
        })
        .populate('reviews.user', 'name avatar')
        .limit(8)
        .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
export const getTrendingProducts = async (req, res) => {
    try {
        const products = await Product.find({ 
            trending: true,
            isActive: true 
        })
        .populate('reviews.user', 'name avatar')
        .limit(8)
        .sort('-totalSales');

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const addProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            review => review.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        const review = {
            user: req.user._id,
            rating: Number(rating),
            comment
        };

        product.reviews.push(review);
        product.averageRating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            reviews: product.reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};