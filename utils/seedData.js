// backend/utils/seedData.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected for seeding...');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

const seedUsers = async () => {
    const users = [
        {
            name: 'Admin User',
            email: 'admin@fashionbd.com',
            password: await bcrypt.hash('123456', 12),
            phone: '01712345678',
            role: 'admin',
            language: 'en',
            isActive: true
        },
        {
            name: 'John Doe',
            email: 'john@example.com',
            password: await bcrypt.hash('123456', 12),
            phone: '01712345679',
            role: 'customer',
            language: 'en',
            addresses: [
                {
                    type: 'home',
                    name: 'John Doe',
                    phone: '01712345679',
                    division: 'Dhaka',
                    district: 'Dhaka',
                    upazila: 'Mohammadpur',
                    address: 'House 123, Road 456',
                    postalCode: '1207',
                    isDefault: true
                }
            ]
        },
        {
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: await bcrypt.hash('123456', 12),
            phone: '01812345678',
            role: 'customer',
            language: 'en'
        }
    ];

    await User.deleteMany({});
    await User.insertMany(users);
    console.log('Users seeded successfully');
};

const seedProducts = async () => {
    const products = [
        // Men's Clothing
        {
            name: {
                en: "Men's Classic T-Shirt",
                bn: "পুরুষদের ক্লাসিক টি-শার্ট"
            },
            description: {
                en: "Premium quality cotton t-shirt for men. Comfortable and stylish for everyday wear.",
                bn: "পুরুষদের জন্য প্রিমিয়াম কোয়ালিটি কটন টি-শার্ট। প্রতিদিনের পরিধানের জন্য আরামদায়ক এবং স্টাইলিশ।"
            },
            price: 899,
            originalPrice: 1299,
            discount: 30,
            category: 'men',
            subcategory: 't-shirts',
            brand: 'FashionBD',
            sizes: [
                { size: 'S', stock: 25 },
                { size: 'M', stock: 30 },
                { size: 'L', stock: 20 },
                { size: 'XL', stock: 15 }
            ],
            colors: [
                { name: { en: 'Black', bn: 'কালো' }, code: '#000000', stock: 50 },
                { name: { en: 'White', bn: 'সাদা' }, code: '#FFFFFF', stock: 45 },
                { name: { en: 'Navy Blue', bn: 'নেভি ব্লু' }, code: '#000080', stock: 35 }
            ],
            images: [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
                'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500'
            ],
            featured: true,
            trending: true,
            tags: ['tshirt', 'cotton', 'men', 'casual'],
            specifications: {
                en: {
                    "Material": "100% Cotton",
                    "Fit": "Regular",
                    "Sleeve": "Short Sleeve",
                    "Neck": "Round Neck",
                    "Care": "Machine Wash"
                },
                bn: {
                    "মaterial": "১০০% কটন",
                    "ফিট": "রেগুলার",
                    "স্লিভ": "শর্ট স্লিভ",
                    "নেক": "রাউন্ড নেক",
                    "যত্ন": "মেশিন ওয়াশ"
                }
            },
            averageRating: 4.5,
            totalSales: 150,
            isActive: true
        },
        {
            name: {
                en: "Men's Denim Jeans",
                bn: "পুরুষদের ডেনিম জিন্স"
            },
            description: {
                en: "Classic denim jeans with modern fit. Perfect for casual and semi-formal occasions.",
                bn: "আধুনিক ফিট সহ ক্লাসিক ডেনিম জিন্স। ক্যাজুয়াল এবং সেমি-ফরমাল অনুষ্ঠানের জন্য পারফেক্ট।"
            },
            price: 2499,
            originalPrice: 2999,
            discount: 16,
            category: 'men',
            subcategory: 'jeans',
            brand: 'DenimCo',
            sizes: [
                { size: '30', stock: 15 },
                { size: '32', stock: 20 },
                { size: '34', stock: 18 },
                { size: '36', stock: 12 }
            ],
            colors: [
                { name: { en: 'Blue', bn: 'নীল' }, code: '#191970', stock: 40 },
                { name: { en: 'Black', bn: 'কালো' }, code: '#000000', stock: 30 }
            ],
            images: [
                'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
                'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500'
            ],
            featured: true,
            tags: ['jeans', 'denim', 'men', 'pants'],
            specifications: {
                en: {
                    "Material": "98% Cotton, 2% Elastane",
                    "Fit": "Slim Fit",
                    "Closure": "Zip Fly",
                    "Pockets": "5 Pockets",
                    "Wash": "Stone Wash"
                },
                bn: {
                    "মaterial": "৯৮% কটন, ২% ইলাস্টেন",
                    "ফিট": "স্লিম ফিট",
                    "ক্লোজার": "জিপ ফ্লাই",
                    "পকেট": "৫ পকেট",
                    "ওয়াশ": "স্টোন ওয়াশ"
                }
            },
            averageRating: 4.3,
            totalSales: 89,
            isActive: true
        },

        // Women's Clothing
        {
            name: {
                en: "Women's Floral Dress",
                bn: "মহিলাদের ফ্লোরাল ড্রেস"
            },
            description: {
                en: "Elegant floral print dress for women. Perfect for summer parties and casual outings.",
                bn: "মহিলাদের জন্য মার্জিত ফ্লোরাল প্রিন্ট ড্রেস। গ্রীষ্মের পার্টি এবং ক্যাজুয়াল আউটিংয়ের জন্য পারফেক্ট।"
            },
            price: 1899,
            originalPrice: 2299,
            discount: 17,
            category: 'women',
            subcategory: 'dresses',
            brand: 'Elegance',
            sizes: [
                { size: 'S', stock: 20 },
                { size: 'M', stock: 25 },
                { size: 'L', stock: 18 },
                { size: 'XL', stock: 12 }
            ],
            colors: [
                { name: { en: 'Pink', bn: 'গোলাপী' }, code: '#FFB6C1', stock: 35 },
                { name: { en: 'Blue', bn: 'নীল' }, code: '#ADD8E6', stock: 28 }
            ],
            images: [
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
                'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500'
            ],
            featured: true,
            trending: true,
            tags: ['dress', 'floral', 'women', 'summer'],
            specifications: {
                en: {
                    "Material": "Polyester",
                    "Length": "Knee Length",
                    "Sleeve": "Short Sleeve",
                    "Pattern": "Floral Print",
                    "Care": "Hand Wash Recommended"
                },
                bn: {
                    "মaterial": "পলিয়েস্টার",
                    "দৈর্ঘ্য": "হাঁটু পর্যন্ত",
                    "স্লিভ": "শর্ট স্লিভ",
                    "প্যাটার্ন": "ফ্লোরাল প্রিন্ট",
                    "যত্ন": "হ্যান্ড ওয়াশ রিকমেন্ডেড"
                }
            },
            averageRating: 4.7,
            totalSales: 120,
            isActive: true
        },

        // Shoes
        {
            name: {
                en: "Men's Running Shoes",
                bn: "পুরুষদের রানিং জুতা"
            },
            description: {
                en: "Comfortable running shoes with advanced cushioning technology. Perfect for sports and casual wear.",
                bn: "অ্যাডভান্সড কুশনিং টেকনোলজি সহ আরামদায়ক রানিং জুতা। স্পোর্টস এবং ক্যাজুয়াল পরিধানের জন্য পারফেক্ট।"
            },
            price: 3499,
            originalPrice: 3999,
            discount: 12,
            category: 'shoes',
            subcategory: 'sports',
            brand: 'RunPro',
            sizes: [
                { size: '8', stock: 15 },
                { size: '9', stock: 20 },
                { size: '10', stock: 18 },
                { size: '11', stock: 12 }
            ],
            colors: [
                { name: { en: 'Black', bn: 'কালো' }, code: '#000000', stock: 40 },
                { name: { en: 'Blue', bn: 'নীল' }, code: '#0000FF', stock: 35 },
                { name: { en: 'Red', bn: 'লাল' }, code: '#FF0000', stock: 25 }
            ],
            images: [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
                'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500'
            ],
            featured: true,
            trending: true,
            tags: ['shoes', 'sports', 'running', 'men'],
            specifications: {
                en: {
                    "Material": "Mesh & Synthetic",
                    "Sole": "Rubber",
                    "Closure": "Lace-up",
                    "Technology": "Air Cushioning",
                    "Activity": "Running, Gym"
                },
                bn: {
                    "মaterial": "মেশ ও সিনথেটিক",
                    "সোল": "রাবার",
                    "ক্লোজার": "লেস-আপ",
                    "টেকনোলজি": "এয়ার কুশনিং",
                    "একটিভিটি": "রানিং, জিম"
                }
            },
            averageRating: 4.6,
            totalSales: 95,
            isActive: true
        },

        // Accessories
        {
            name: {
                en: "Leather Wallet",
                bn: "লেদার ওয়ালেট"
            },
            description: {
                en: "Genuine leather wallet with multiple card slots and cash compartment. Durable and stylish.",
                bn: "একাধিক কার্ড স্লট এবং ক্যাশ কম্পার্টমেন্ট সহ জেনুইন লেদার ওয়ালেট। টেকসই এবং স্টাইলিশ।"
            },
            price: 1299,
            originalPrice: 1599,
            discount: 18,
            category: 'accessories',
            subcategory: 'wallets',
            brand: 'LeatherCraft',
            sizes: [
                { size: 'One Size', stock: 50 }
            ],
            colors: [
                { name: { en: 'Brown', bn: 'বাদামী' }, code: '#8B4513', stock: 60 },
                { name: { en: 'Black', bn: 'কালো' }, code: '#000000', stock: 45 }
            ],
            images: [
                'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
                'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500'
            ],
            featured: true,
            tags: ['wallet', 'leather', 'accessory', 'men'],
            specifications: {
                en: {
                    "Material": "Genuine Leather",
                    "Color": "Brown/Black",
                    "Slots": "8 Card Slots",
                    "Compartment": "2 Cash Compartments",
                    "Closure": "Button"
                },
                bn: {
                    "মaterial": "জেনুইন লেদার",
                    "রং": "বাদামী/কালো",
                    "স্লট": "৮ কার্ড স্লট",
                    "কম্পার্টমেন্ট": "২ ক্যাশ কম্পার্টমেন্ট",
                    "ক্লোজার": "বাটন"
                }
            },
            averageRating: 4.4,
            totalSales: 78,
            isActive: true
        },

        // More products...
        {
            name: {
                en: "Women's Handbag",
                bn: "মহিলাদের হ্যান্ডব্যাগ"
            },
            description: {
                en: "Stylish women's handbag with ample space. Perfect for daily use and special occasions.",
                bn: "পর্যাপ্ত স্থান সহ স্টাইলিশ মহিলাদের হ্যান্ডব্যাগ। দৈনন্দিন ব্যবহার এবং বিশেষ অনুষ্ঠানের জন্য পারফেক্ট।"
            },
            price: 2199,
            category: 'accessories',
            subcategory: 'bags',
            brand: 'StyleBag',
            sizes: [
                { size: 'One Size', stock: 30 }
            ],
            colors: [
                { name: { en: 'Beige', bn: 'বেইজ' }, code: '#F5F5DC', stock: 25 },
                { name: { en: 'Black', bn: 'কালো' }, code: '#000000', stock: 20 }
            ],
            images: [
                'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500'
            ],
            trending: true,
            tags: ['handbag', 'women', 'accessory'],
            averageRating: 4.2,
            totalSales: 65,
            isActive: true
        }
    ];

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products seeded successfully');
};

const seedDatabase = async () => {
    try {
        await connectDB();
        
        console.log('Starting database seeding...');
        
        await seedUsers();
        await seedProducts();
        
        console.log('Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedDatabase();
}

export default seedDatabase;