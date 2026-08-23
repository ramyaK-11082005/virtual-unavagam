import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const steps = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/orders/${id}`);
      setOrder(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load order details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Auto polling for status updates (optional / fun startup addition)
    const interval = setInterval(fetchOrder, 15000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Consulting kitchen logs..." />;
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h3>Order not found</h3>
        <Link to="/orders" className="btn btn-orange mt-3">Back to Orders</Link>
      </div>
    );
  }

  // Get active step index for Stepper
  let activeStep = steps.indexOf(order.orderStatus);
  if (activeStep === -1) {
    if (order.orderStatus === 'Cancelled') {
      activeStep = -2; // Custom state handled separately
    } else {
      activeStep = 0;
    }
  }

  return (
    <div className="container py-5 fade-in text-start">
      <button onClick={() => navigate('/orders')} className="btn btn-orange-outline btn-sm mb-4 d-flex align-items-center gap-2">
        <ArrowBackIcon fontSize="small" /> Back to Orders
      </button>

      <h1 className="fw-bold mb-4">Order Details</h1>

      <div className="row gy-4">
        {/* Stepper Status tracker */}
        <div className="col-12">
          <Paper variant="outlined" sx={{ p: 4, borderRadius: '20px', borderColor: 'var(--border-color)', bgcolor: 'background.paper' }}>
            <Box mb={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>
                Order ID: <span style={{ color: 'var(--primary-orange)' }}>#{order._id}</span>
              </Typography>
            </Box>

            <hr className="my-4" />

            {order.orderStatus === 'Cancelled' ? (
              <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.dark', borderRadius: '12px', textAlign: 'center', fontWeight: 700 }}>
                ❌ THIS ORDER HAS BEEN CANCELLED
              </Box>
            ) : (
              <Box sx={{ width: '100%', py: 2 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            )}
          </Paper>
        </div>

        {/* Left Col: Order Items */}
        <div className="col-12 col-lg-8">
          <Paper variant="outlined" sx={{ p: 4, borderRadius: '20px', borderColor: 'var(--border-color)', bgcolor: 'background.paper' }}>
            <h5 className="fw-bold mb-4">Items Ordered</h5>

            <div className="d-flex flex-column gap-3 mb-4">
              {order.items.map((item) => (
                <div key={item._id} className="d-flex align-items-center justify-content-between border-bottom pb-3">
                  <div>
                    <h6 className="fw-bold mb-1">{item.name}</h6>
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                      ₹{item.price} × {item.quantity}
                    </span>
                  </div>
                  <span className="fw-bold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="row justify-content-end">
              <div className="col-12 col-sm-6 col-md-5">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>₹{order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Delivery Fee</span>
                  <span>₹40</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">GST Tax (9%)</span>
                  <span>₹{Math.round(order.items.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.09)}</span>
                </div>
                {order.items.reduce((acc, item) => acc + item.price * item.quantity, 0) > 500 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Discount</span>
                    <span>-₹50</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-6">
                  <span>Grand Total</span>
                  <span style={{ color: 'var(--primary-orange)' }}>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </Paper>
        </div>

        {/* Right Col: Address / Payment details */}
        <div className="col-12 col-lg-4">
          <div className="d-flex flex-column gap-4">
            <Paper variant="outlined" sx={{ p: 4, borderRadius: '20px', borderColor: 'var(--border-color)', bgcolor: 'background.paper' }}>
              <h5 className="fw-bold mb-3">Delivery Address</h5>
              <p className="mb-0 text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                {order.deliveryAddress}
              </p>
            </Paper>

            <Paper variant="outlined" sx={{ p: 4, borderRadius: '20px', borderColor: 'var(--border-color)', bgcolor: 'background.paper' }}>
              <h5 className="fw-bold mb-3">Payment Info</h5>
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.9rem' }}>
                <span className="text-muted">Method</span>
                <span className="fw-semibold">{order.paymentMethod}</span>
              </div>
              <div className="d-flex justify-content-between" style={{ fontSize: '0.9rem' }}>
                <span className="text-muted">Status</span>
                <span className="fw-bold text-success">Simulated / Paid</span>
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
