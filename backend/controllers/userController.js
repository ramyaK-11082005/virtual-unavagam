import User from '../models/User.js';
import Order from '../models/Order.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    if (user) {
      // Calculate order statistics
      const totalOrders = await Order.countDocuments({ user: user._id });
      const completedOrders = await Order.countDocuments({ user: user._id, orderStatus: 'Delivered' });
      const pendingOrders = await Order.countDocuments({ user: user._id, orderStatus: { $in: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery'] } });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        favorites: user.favorites,
        stats: {
          totalOrders,
          completedOrders,
          pendingOrders,
        }
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.address = req.body.address !== undefined ? req.body.address : user.address;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const populatedUser = await User.findById(updatedUser._id).populate('favorites');
      
      const totalOrders = await Order.countDocuments({ user: user._id });
      const completedOrders = await Order.countDocuments({ user: user._id, orderStatus: 'Delivered' });
      const pendingOrders = await Order.countDocuments({ user: user._id, orderStatus: { $in: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery'] } });

      res.json({
        _id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        phone: populatedUser.phone,
        address: populatedUser.address,
        role: populatedUser.role,
        favorites: populatedUser.favorites,
        stats: {
          totalOrders,
          completedOrders,
          pendingOrders,
        }
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get favorites list
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    if (user) {
      res.json(user.favorites);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add food to favorites
// @route   POST /api/users/favorites/:foodId
// @access  Private
export const addFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const { foodId } = req.params;
    if (!user.favorites.includes(foodId)) {
      user.favorites.push(foodId);
      await user.save();
    }

    res.json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove food from favorites
// @route   DELETE /api/users/favorites/:foodId
// @access  Private
export const removeFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const { foodId } = req.params;
    user.favorites = user.favorites.filter((id) => id.toString() !== foodId);
    await user.save();

    res.json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};
