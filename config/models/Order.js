// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    items: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product',
            required: true 
        },
        name: {
            en: { type: String, required: true },
            bn: { type: String, required: true }
        },
        quantity: { 
            type: Number, 
            required: true,
            min: [1, 'Quantity must be at least 1']
        },
        price: { 
            type: Number, 
            required: true,
            min: [0, 'Price cannot be negative']
        },
        size: String,
        color: String,
        image: { type: String, required: true }
    }],
    totalAmount: { 
        type: Number, 
        required: true,
        min: [0, 'Total amount cannot be negative']
    },
    discount: { 
        type: Number, 
        default: 0,
        min: [0, 'Discount cannot be negative']
    },
    shippingFee: { 
        type: Number, 
        default: 0,
        min: [0, 'Shipping fee cannot be negative']
    },
    finalAmount: { 
        type: Number, 
        required: true,
        min: [0, 'Final amount cannot be negative']
    },
    currency: { 
        type: String, 
        default: 'BDT' 
    },
    paymentMethod: { 
        type: String, 
        required: true,
        enum: ['bkash', 'nagad', 'cod', 'card'] 
    },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'completed', 'failed', 'refunded'], 
        default: 'pending' 
    },
    transactionId: String,
    paidAmount: { 
        type: Number, 
        default: 0 
    },
    orderStatus: { 
        type: String, 
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
        default: 'pending' 
    },
    shippingAddress: {
        name: { type: String, required: true },
        phone: { 
            type: String, 
            required: true,
            match: [/^01[3-9]\d{8}$/, 'Please enter a valid Bangladeshi phone number']
        },
        division: { type: String, required: true },
        district: { type: String, required: true },
        upazila: { type: String, required: true },
        address: { type: String, required: true },
        postalCode: { type: String, required: true }
    },
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Generate unique order ID before saving
orderSchema.pre('save', async function(next) {
    if (!this.orderId) {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.orderId = `ORD-${timestamp}-${random}`;
    }
    
    // Update final amount
    this.finalAmount = this.totalAmount - this.discount + this.shippingFee;
    this.updatedAt = Date.now();
    
    next();
});

// Update product stock and sales after order is completed
orderSchema.post('save', async function(doc) {
    if (doc.paymentStatus === 'completed' && doc.orderStatus === 'confirmed') {
        const Product = mongoose.model('Product');
        
        for (const item of doc.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { 
                    $inc: { 
                        totalSales: item.quantity,
                        'sizes.$[elem].stock': -item.quantity 
                    } 
                },
                { 
                    arrayFilters: [{ 'elem.size': item.size }] 
                }
            );
        }
    }
});

export default mongoose.model('Order', orderSchema);