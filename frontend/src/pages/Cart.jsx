import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const Cart = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, calculateTotals } = useCart();
  const navigate = useNavigate();

  const { subtotal, deliveryFee, tax, discount, grandTotal } = calculateTotals();

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center fade-in">
        <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🍕</div>
        <h2 className="fw-bold mb-3">Your cart is empty</h2>
        <p className="text-muted mb-4">Add some of our freshly baked items to satisfy your cravings!</p>
        <Link to="/menu" className="btn btn-orange text-uppercase px-5 py-2.5">
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5 fade-in text-start">
      <h1 className="fw-bold mb-4">Shopping Cart</h1>

      <div className="row gy-4">
        {/* Cart Items List */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
            <div className="list-group list-group-flush">
              {cartItems.map((item) => (
                <div key={item.food} className="list-group-item p-3 border-bottom" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                  <div className="row align-items-center gy-3">
                    {/* Image */}
                    <div className="col-4 col-sm-2 text-center">
                      <img src={item.image} alt={item.name} className="img-fluid rounded-3" style={{ maxHeight: '70px', objectFit: 'cover' }} />
                    </div>

                    {/* Info */}
                    <div className="col-8 col-sm-4">
                      <h6 className="fw-bold mb-1">{item.name}</h6>
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>₹{item.price} / item</span>
                    </div>

                    {/* Quantity controls */}
                    <div className="col-6 col-sm-3 d-flex justify-content-center justify-content-sm-start">
                      <div className="quantity-control">
                        <button className="quantity-btn" onClick={() => decreaseQuantity(item.food)}>-</button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button className="quantity-btn" onClick={() => increaseQuantity(item.food)}>+</button>
                      </div>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="col-6 col-sm-3 d-flex align-items-center justify-content-between">
                      <span className="fw-bold fs-6" style={{ color: 'var(--primary-orange)' }}>₹{item.price * item.quantity}</span>
                      <IconButton color="error" onClick={() => removeFromCart(item.food)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="col-12 col-lg-4">
          <div className="card shadow border-0 rounded-4 p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h5 className="fw-bold border-bottom pb-3 mb-3">Order Summary</h5>
            
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span className="fw-semibold">₹{subtotal}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Delivery Fee</span>
              <span className="fw-semibold">₹{deliveryFee}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Tax (9% SGST/CGST)</span>
              <span className="fw-semibold">₹{tax}</span>
            </div>

            {discount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Combo Discount</span>
                <span className="fw-semibold">-₹{discount}</span>
              </div>
            )}

            <hr className="my-3" />

            <div className="d-flex justify-content-between mb-4">
              <span className="fw-bold fs-5">Grand Total</span>
              <span className="fw-bold fs-5" style={{ color: 'var(--primary-orange)' }}>₹{grandTotal}</span>
            </div>

            <button onClick={() => navigate('/checkout')} className="btn btn-orange w-100 py-3 text-uppercase">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
