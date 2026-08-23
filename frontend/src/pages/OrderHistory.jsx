import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-secondary';
      case 'Confirmed': return 'text-info';
      case 'Preparing': return 'text-primary';
      case 'Out for Delivery': return 'text-warning';
      case 'Delivered': return 'text-success';
      case 'Cancelled': return 'text-danger';
      default: return 'text-muted';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving order history..." />;
  }

  return (
    <div className="container py-5 fade-in text-start">
      <h1 className="fw-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-5 border rounded-4" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <span style={{ fontSize: '4rem' }}>📦</span>
          <h4 className="fw-bold mt-3">No orders placed yet</h4>
          <p className="text-muted">Explore our delicious menu items and place your first order!</p>
          <Button variant="contained" color="primary" onClick={() => navigate('/menu')} sx={{ mt: 2 }}>
            Explore Menu
          </Button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <Paper
              key={order._id}
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: '16px',
                borderColor: 'var(--border-color)',
                bgcolor: 'background.paper',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              <div className="row align-items-center gy-3">
                {/* ID & Date */}
                <div className="col-12 col-md-4">
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <h6 className="fw-bold mb-0 mt-1">
                    Order ID: <span style={{ color: 'var(--primary-orange)' }}>#{order._id}</span>
                  </h6>
                </div>

                {/* Items Summary */}
                <div className="col-12 col-md-4">
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>Items</span>
                  <p className="mb-0 text-truncate fw-semibold" style={{ fontSize: '0.9rem' }}>
                    {order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}
                  </p>
                </div>

                {/* Pricing & Status */}
                <div className="col-6 col-md-2 text-md-center">
                  <span className="text-muted d-block" style={{ fontSize: '0.85rem' }}>Total</span>
                  <span className="fw-bold text-danger">₹{order.totalAmount}</span>
                </div>

                <div className="col-6 col-md-2 text-end">
                  <span className={`fw-bold d-block text-uppercase mb-2 ${getStatusColor(order.orderStatus)}`} style={{ fontSize: '0.8rem' }}>
                    ● {order.orderStatus}
                  </span>
                  <button onClick={() => navigate(`/orders/${order._id}`)} className="btn btn-orange-outline btn-sm text-uppercase">
                    View Details
                  </button>
                </div>
              </div>
            </Paper>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
