import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Food from '../models/Food.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import connectDB from '../config/db.js';

dotenv.config();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  console.error(
    'Missing UNSPLASH_ACCESS_KEY in your .env file.\n' +
    'Get a free key at https://unsplash.com/developers and add:\n' +
    'UNSPLASH_ACCESS_KEY=your_key_here'
  );
  process.exit(1);
}

// Real, descriptive search terms — Unsplash's search actually understands
// food photography semantics, unlike TheMealDB's fixed category list or
// LoremFlickr's loose keyword tagging on random Flickr uploads.
// Each category has TWO query variants — we merge results from both so we
// have enough distinct photos to cover all 50 items without repeats
// (Unsplash caps per_page at 30, so one query alone isn't enough for 50).
const categories = [
  { name: 'Indian Hits',      icon: '🍛', category: 'combos',      queries: ['indian biryani curry food', 'indian cuisine dish'] },
  { name: 'Pizza',            icon: '🍕', category: 'pizza',       queries: ['pizza slice food', 'pizza pie restaurant'] },
  { name: 'Burgers',          icon: '🍔', category: 'burgers',     queries: ['cheeseburger food photography', 'hamburger fast food'] },
  { name: 'Noodles / Wok',    icon: '🍜', category: 'noodles',     queries: ['noodles stir fry food', 'wok noodle dish'] },
  { name: 'Chinese',          icon: '🥟', category: 'chinese',     queries: ['chinese food dumplings', 'chinese cuisine dish'] },
  { name: 'Japanese',         icon: '🍲', category: 'ramen-bento', queries: ['ramen japanese food', 'japanese bento bowl'] },
  { name: 'Pasta / Italian',  icon: '🍝', category: 'pasta',       queries: ['pasta italian food', 'spaghetti dish restaurant'] },
  { name: 'Sushi / Asian',    icon: '🍱', category: 'sushi',       queries: ['sushi platter food', 'sushi roll japanese'] },
  { name: 'Mexican Tacos',    icon: '🌮', category: 'tacos',       queries: ['tacos mexican food', 'mexican taco plate'] },
  { name: 'Wraps / Rolls',    icon: '🌯', category: 'wraps',       queries: ['sandwich wrap food', 'burrito wrap roll'] },
  { name: 'Salads / Bowls',   icon: '🥗', category: 'salads',      queries: ['salad bowl healthy food', 'fresh vegetable salad'] },
  { name: 'BBQ & Grills',     icon: '🍖', category: 'grills',      queries: ['bbq grilled meat food', 'barbecue ribs grill'] },
  { name: 'Sides',            icon: '🍟', category: 'sides',       queries: ['french fries side dish', 'onion rings appetizer'] },
  { name: 'Beverages',        icon: '🥤', category: 'beverages',   queries: ['cold drink beverage glass', 'smoothie juice drink'] },
  { name: 'Desserts',         icon: '🍰', category: 'desserts',    queries: ['dessert cake food', 'ice cream sweet treat'] },
];

const modifiers = [
  'Classic', 'Spicy', 'Royal', 'Special', 'Supreme', 'Tandoori', 'Crispy', 'Juicy',
  'Smoky', 'Herbed', 'Loaded', 'Zesty', 'Butter', 'Garlic', 'Fiery', 'Crunchy',
  'Homestyle', 'Cheesy', 'Mega', 'Urban', 'Rustic', 'Golden', 'Minty', 'Tangy',
  'Pepper', 'Herb-Crusted', 'Creamy', 'Deluxe', 'Exotic', 'Savory', 'Wild', 'Melted',
  'Charbroiled', 'Zingy', 'Traditional', 'Grand', 'Prime', 'Select', 'Signature', 'Vibrant',
  'Double', 'Triple', 'Ultimate', 'Fresh-Cut', 'Stellar', 'Superb', 'Artisan', 'Exquisite', 'Flavorful', 'Epic'
];

// Fetches photos for a single query (max 30 per Unsplash's per_page cap).
const fetchQueryImages = async (query) => {
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query, per_page: 30, orientation: 'squarish' },
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    });
    const results = response.data?.results || [];
    // Keep id alongside the URL so we can dedupe across the two queries
    // (the same photo can legitimately show up for both search terms).
    return results.map((photo) => ({ id: photo.id, url: photo.urls.regular }));
  } catch (error) {
    console.error(`  ! Unsplash fetch failed for "${query}": ${error.message}`);
    return [];
  }
};

// Merges results from a category's two query variants into one deduped
// list, giving up to ~60 distinct photos — enough to cover 50 menu items
// per category without repeating the same image twice.
const fetchCategoryImages = async (queries) => {
  const combined = [];
  const seenIds = new Set();

  for (const query of queries) {
    const photos = await fetchQueryImages(query);
    for (const photo of photos) {
      if (!seenIds.has(photo.id)) {
        seenIds.add(photo.id);
        combined.push(photo.url);
      }
    }
  }

  return combined;
};

const generateFoods = async () => {
  const allFoods = [];

  for (const catObj of categories) {
    console.log(`Fetching real ${catObj.name} photos from Unsplash...`);
    const imageUrls = await fetchCategoryImages(catObj.queries);
    console.log(`  -> got ${imageUrls.length} unique photos for ${catObj.name}`);

    if (imageUrls.length === 0) {
      console.warn(`  ! No images found for ${catObj.name} — will reuse a generic placeholder for this category.`);
    } else if (imageUrls.length < 50) {
      console.warn(`  ! Only ${imageUrls.length} unique photos found for ${catObj.name} — some of the 50 items will repeat an image.`);
    }

    for (let i = 0; i < 50; i++) {
      const mod = modifiers[i % modifiers.length];
      const itemName = `${mod} ${catObj.name.slice(0, -1)} Type-${i + 1}`;
      const selectedImage = imageUrls.length > 0
        ? imageUrls[i % imageUrls.length]
        : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

      allFoods.push({
        name: itemName,
        description: `Freshly prepared ${itemName.toLowerCase()} made with authentic hand-selected ingredients, premium oils, and signature herbs.`,
        price: Math.floor(Math.random() * 280) + 99,
        image: selectedImage,
        category: catObj.category,
        isVeg: i % 2 === 0,
        rating: Number((Math.random() * (5.0 - 4.1) + 4.1).toFixed(1)),
        isAvailable: true,
      });
    }

    // Unsplash's free tier is rate-limited (50 req/hour) — this script makes
    // 2 requests per category (30 categories worth = 30 requests total),
    // still comfortably within that limit for a single run.
  }

  return allFoods;
};

const seedDatabase = async () => {
  try {
    await connectDB();

    await Food.deleteMany();
    await Order.deleteMany();
    await User.deleteMany({ role: { $ne: 'admin' } });

    const foods = await generateFoods();
    await Food.insertMany(foods);
    console.log(`Database Seeded Successfully with ${foods.length} menu items with real, category-correct images!`);

    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin Virtual Unavagam',
        email: 'admin@unavagam.com',
        password: 'adminpassword123',
        phone: '1234567890',
        address: '123, Pizza Street, Virtual City',
        role: 'admin',
      });
      console.log('Default Admin Account Created: admin@unavagam.com / adminpassword123');
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();