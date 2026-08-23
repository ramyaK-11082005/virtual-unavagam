import express from 'express';
import { getUserProfile, updateUserProfile, getFavorites, addFavorite, removeFavorite } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/favorites')
  .get(protect, getFavorites);

router.route('/favorites/:foodId')
  .post(protect, addFavorite)
  .delete(protect, removeFavorite);

export default router;
