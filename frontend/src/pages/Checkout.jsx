import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../services/api.js';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Checkout = () => {
  const { cartItems, calculateTotals, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null); // Will hold the response order data

  const { subtotal, deliveryFee, tax, discount, grandTotal } = calculateTotals();

  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      showToast('Your cart is empty 🍕', 'warning');
      navigate('/menu');
    }
  }, [cartItems, navigate, orderSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      showToast('Delivery address is required', 'error');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      showToast('Please enter a valid phone number', 'error');
      return;
    }

    try {
      setLoading(true);
      const items = cartItems.map((item) => ({
        food: item.food,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const { data } = await api.post('/api/orders', {
        items,
        deliveryAddress: address,
        paymentMethod,
      });

      setOrderSuccess(data);
      clearCart();
      showToast('Order placed successfully! 🎉', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to place order.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 fade-in text-start">
      <h1 className="fw-bold mb-4">Checkout</h1>

      <div className="row gy-4">
        {/* Form Details */}
        <div className="col-12 col-lg-7">
          <form onSubmit={handleSubmit} className="card shadow-sm border-0 rounded-4 p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h5 className="fw-bold mb-4 border-bottom pb-2">Delivery & Contact Details</h5>

            <div className="mb-3">
              <label className="form-label fw-semibold">Receiver Name</label>
              <input type="text" className="form-control" value={user?.name || ''} disabled style={{ borderRadius: '10px' }} />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Contact Phone Number *</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ borderRadius: '10px' }}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Delivery Address *</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter complete shipping address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                style={{ borderRadius: '10px' }}
              />
            </div>

            <h5 className="fw-bold mb-3 border-bottom pb-2">Select Payment Method</h5>
            <div className="d-flex flex-column gap-2 mb-4">
              {['Cash on Delivery', 'UPI', 'Card'].map((method) => (
                <label
                  key={method}
                  className="d-flex align-items-center p-3 border rounded-3 cursor-pointer"
                  style={{
                    backgroundColor: paymentMethod === method ? 'rgba(255,122,0,0.05)' : 'transparent',
                    borderColor: paymentMethod === method ? 'var(--primary-orange)' : 'var(--border-color)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="me-3"
                  />
                  <div>
                    <span className="fw-semibold">{method}</span>
                    <span className="d-block text-muted" style={{ fontSize: '0.8rem' }}>
                      {method === 'Cash on Delivery' ? 'Pay when food arrives.' : 'Simulated payment processing.'}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <button type="submit" disabled={loading} className="btn btn-orange w-100 py-3 text-uppercase fw-bold">
              {loading ? 'Processing Order...' : `Place Order - ₹${grandTotal}`}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0 rounded-4 p-4 mb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h5 className="fw-bold mb-3 border-bottom pb-2">Order Items</h5>
            
            <div className="d-flex flex-column gap-3 mb-4" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {cartItems.map((item) => (
                <div key={item.food} className="d-flex align-items-center gap-3">
                  <img src={item.image} alt={item.name} className="rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>{item.name}</h6>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>₹{item.price} × {item.quantity}</span>
                  </div>
                  <span className="fw-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <h5 className="fw-bold mb-3 border-bottom pb-2">Price Details</h5>
            <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.9rem' }}>
              <span className="text-muted">Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.9rem' }}>
              <span className="text-muted">Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.9rem' }}>
              <span className="text-muted">GST / Tax</span>
              <span>₹{tax}</span>
            </div>
            {discount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-success" style={{ fontSize: '0.9rem' }}>
                <span>Combo Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <hr />
            <div className="d-flex justify-content-between">
              <span className="fw-bold fs-6">Total Amount</span>
              <span className="fw-bold fs-6" style={{ color: 'var(--primary-orange)' }}>₹{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal popup */}
      <Dialog
        open={Boolean(orderSuccess)}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 3,
            textAlign: 'center',
            maxWidth: '450px',
            bgcolor: 'background.default',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: '80px', animation: 'pulse 1.5s infinite' }} />
            
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              🎉 Order Confirmed!
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Your delicious food is being prepared in our kitchens.
            </Typography>

            <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: '12px', width: '100%', my: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Order ID: <span style={{ color: 'var(--primary-orange)' }}>#{orderSuccess?._id}</span>
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Total Paid: ₹{orderSuccess?.totalAmount}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={() => {
                const id = orderSuccess._id;
                setOrderSuccess(null);
                navigate(`/orders/${id}`);
              }}
              sx={{ py: 1.5, borderRadius: '30px', fontWeight: 700 }}
            >
              View Order Details
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
