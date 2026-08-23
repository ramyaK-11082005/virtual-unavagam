import Food from '../models/Food.js';

// @desc    Get all foods with filtering, sorting, searching
// @route   GET /api/foods
// @access  Public
export const getFoods = async (req, res, next) => {
  try {
    const { category, isVeg, search, sort } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (isVeg !== undefined && isVeg !== '') {
      query.isVeg = isVeg === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let apiQuery = Food.find(query);

    if (sort) {
      if (sort === 'priceLowHigh') {
        apiQuery = apiQuery.sort({ price: 1 });
      } else if (sort === 'priceHighLow') {
        apiQuery = apiQuery.sort({ price: -1 });
      } else if (sort === 'rating') {
        apiQuery = apiQuery.sort({ rating: -1 });
      } else if (sort === 'popular') {
        apiQuery = apiQuery.sort({ rating: -1 }); // Fallback sorting for popular
      }
    }

    const foods = await apiQuery;
    res.json(foods);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food by ID
// @route   GET /api/foods/:id
// @access  Public
export const getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food) {
      res.json(food);
    } else {
      res.status(404);
      throw new Error('Food item not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a food item
// @route   POST /api/foods
// @access  Private/Admin
export const createFood = async (req, res, next) => {
  try {
    const { name, description, price, image, category, isVeg, rating, isAvailable } = req.body;
    const food = new Food({
      name,
      description,
      price,
      image,
      category,
      isVeg,
      rating,
      isAvailable,
    });
    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
export const updateFood = async (req, res, next) => {
  try {
    const { name, description, price, image, category, isVeg, rating, isAvailable } = req.body;
    const food = await Food.findById(req.params.id);

    if (food) {
      food.name = name || food.name;
      food.description = description || food.description;
      food.price = price !== undefined ? price : food.price;
      food.image = image || food.image;
      food.category = category || food.category;
      food.isVeg = isVeg !== undefined ? isVeg : food.isVeg;
      food.rating = rating !== undefined ? rating : food.rating;
      food.isAvailable = isAvailable !== undefined ? isAvailable : food.isAvailable;

      const updatedFood = await food.save();
      res.json(updatedFood);
    } else {
      res.status(404);
      throw new Error('Food item not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
export const deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food) {
      await food.deleteOne();
      res.json({ message: 'Food item removed' });
    } else {
      res.status(404);
      throw new Error('Food item not found');
    }
  } catch (error) {
    next(error);
  }
};
