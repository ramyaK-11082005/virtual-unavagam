import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const { user, toggleFavorite } = useAuth();
  const { showToast } = useToast();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const fetchFood = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/foods/${id}`);
      setFood(data);
    } catch (err) {
      console.error('Error fetching food details:', err);
      showToast('Unable to load food details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFood();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Reading secret recipes..." />;
  }

  if (!food) {
    return (
      <div className="container py-5 text-center">
        <h3 className="fw-bold">Recipe Not Found</h3>
        <Link to="/menu" className="btn btn-orange mt-3">Back to Menu</Link>
      </div>
    );
  }

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
    addToCart(food, quantity);
    showToast(`${quantity} ${food.name} added to cart`, 'success');
  };

  return (
    <div className="container py-5 fade-in">
      <button onClick={() => navigate(-1)} className="btn btn-orange-outline btn-sm mb-4 d-flex align-items-center gap-2">
        <ArrowBackIcon fontSize="small" /> Back
      </button>

      <div className="row gy-4 align-items-center">
        {/* Graphic */}
        <div className="col-12 col-md-6">
          <div className="position-relative overflow-hidden rounded-4 shadow-lg">
            <img src={food.image} alt={food.name} className="img-fluid w-100" style={{ maxHeight: '450px', objectFit: 'cover' }} />
            
            {/* Veg tag */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                backgroundColor: 'rgba(255,255,255,0.95)',
                padding: '6px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                color: 'var(--deep-brown)'
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: food.isVeg ? '#2e7d32' : '#d32f2f'
                }}
              ></span>
              {food.isVeg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
            </div>

            {/* Favorite button */}
            <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
              <IconButton
                onClick={handleFavoriteClick}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  p: 1.5
                }}
              >
                {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon style={{ color: 'var(--deep-brown)' }} />}
              </IconButton>
            </div>
          </div>
        </div>

        {/* Details Text */}
        <div className="col-12 col-md-6 text-start">
          <span className="badge bg-warning text-dark text-uppercase mb-2 px-3 py-1.5 fw-bold" style={{ fontSize: '0.75rem', borderRadius: '20px' }}>
            {food.category}
          </span>
          
          <h1 className="fw-extrabold mb-3" style={{ fontWeight: 800 }}>{food.name}</h1>
          
          {/* Rating */}
          <div className="d-flex align-items-center mb-4" style={{ color: '#ffb300' }}>
            <StarIcon />
            <span className="fw-bold fs-5 ms-1">{food.rating.toFixed(1)}</span>
            <span className="text-muted ms-2" style={{ fontSize: '0.9rem' }}>(Customer Favorite)</span>
          </div>

          <p className="lead mb-4 text-muted" style={{ lineHeight: '1.8' }}>
            {food.description}
          </p>

          <h3 className="fw-bold mb-4" style={{ color: 'var(--primary-orange)' }}>
            Price: ₹{food.price}
          </h3>

          {/* Add actions */}
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="quantity-control" style={{ padding: '4px' }}>
              <button className="quantity-btn" style={{ width: '40px', height: '40px', fontSize: '1.25rem' }} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span className="quantity-value" style={{ fontSize: '1.15rem', padding: '0 15px' }}>{quantity}</span>
              <button className="quantity-btn" style={{ width: '40px', height: '40px', fontSize: '1.25rem' }} onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <button onClick={handleAddToCart} className="btn btn-orange btn-lg text-uppercase px-4 py-3">
              Add to Cart - ₹{food.price * quantity}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
