import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';

const FoodCard = ({ food }) => {
  const { cartItems, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const { user, toggleFavorite } = useAuth();
  const { showToast } = useToast();

  const cartItem = cartItems.find((item) => item.food === food._id);
  const isFavorite = user?.favorites?.some((fav) => fav._id === food._id || fav === food._id) || false;

  const handleFavoriteClick = async () => {
    if (!user) {
      showToast('Please login to favorite items', 'warning');
      return;
    }
    try {
      await toggleFavorite(food._id, isFavorite);
      showToast(isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
    } catch (error) {
      showToast('Failed to update favorites', 'error');
    }
  };

  const handleAddToCart = () => {
    addToCart(food, 1);
    showToast(`${food.name} added to cart`, 'success');
  };

  return (
    <div className="food-card text-start">
      {/* Image & Badges */}
      <div className="food-card-img-wrapper">
        <Link to={`/product/${food._id}`}>
          <img src={food.image} alt={food.name} className="food-card-img" />
        </Link>
        
        {/* Favorite Icon */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
          <IconButton
            onClick={handleFavoriteClick}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon style={{ color: 'var(--deep-brown)' }} />}
          </IconButton>
        </div>

        {/* Veg/Non-Veg Badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            padding: '4px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            fontWeight: '700',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            color: 'var(--deep-brown)'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: food.isVeg ? '#2e7d32' : '#d32f2f'
            }}
          ></span>
          {food.isVeg ? 'VEG' : 'NON-VEG'}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Link to={`/product/${food._id}`} className="text-decoration-none" style={{ color: 'var(--text-color)' }}>
            <h6 className="fw-bold mb-0 text-truncate" style={{ maxWidth: '160px' }}>{food.name}</h6>
          </Link>
          <div className="d-flex align-items-center" style={{ color: '#ffb300', fontSize: '0.85rem' }}>
            <StarIcon fontSize="small" sx={{ mr: 0.5 }} />
            <span className="fw-bold">{food.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-muted text-truncate-2 mb-3" style={{ fontSize: '0.8rem', height: '36px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {food.description}
        </p>

        {/* Price & Cart Actions */}
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="fs-5 fw-bold" style={{ color: 'var(--primary-orange)' }}>₹{food.price}</span>
          
          {cartItem ? (
            <div className="quantity-control">
              <button className="quantity-btn" onClick={() => decreaseQuantity(food._id)}>-</button>
              <span className="quantity-value">{cartItem.quantity}</span>
              <button className="quantity-btn" onClick={() => increaseQuantity(food._id)}>+</button>
            </div>
          ) : (
            <button className="btn btn-orange btn-sm text-uppercase px-3 py-1.5" onClick={handleAddToCart} style={{ borderRadius: '15px', fontSize: '0.8rem' }}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
