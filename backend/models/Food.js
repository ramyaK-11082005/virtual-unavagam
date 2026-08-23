import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['pizza', 
    'burgers', 
    'combos', 
    'noodles', 
    'chinese', 
    'ramen-bento', 
    'pasta', 
    'sushi', 
    'tacos', 
    'wraps', 
    'salads', 
    'grills', 
    'sides', 
    'beverages', 
    'desserts'],
  },
  isVeg: {
    type: Boolean,
    required: true,
    default: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 5.0,
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: true,
  },
}, {
  timestamps: true,
});

const Food = mongoose.model('Food', foodSchema);
export default Food;
