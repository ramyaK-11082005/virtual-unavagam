import React, { useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

const Contact = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill all fields', 'warning');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      showToast('Thank you! Your query has been sent successfully. 📮', 'success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      showToast(error.message || 'Failed to send message', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 fade-in text-start">
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-2">Contact Us</h1>
        <p className="text-muted">We would love to hear from you. Get in touch with our kitchen team!</p>
      </div>

      <div className="row gy-4">
        <div className="col-12 col-md-7">
          <Paper variant="outlined" sx={{ p: 4, borderRadius: '20px', borderColor: 'var(--border-color)', bgcolor: 'background.paper' }}>
            <h4 className="fw-bold mb-4">Send a Message</h4>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <TextField
                  fullWidth
                  label="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <TextField
                  fullWidth
                  label="How can we help you?"
                  multiline
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-orange px-5 py-2.5 text-uppercase">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </Paper>
        </div>

        {/* Operating hours & Details remain unchanged */}
        <div className="col-12 col-md-5">
          <div className="d-flex flex-column gap-4">
            <Paper variant="outlined" sx={{ p: 4, borderRadius: '20px', borderColor: 'var(--border-color)', bgcolor: 'background.paper' }}>
              <h5 className="fw-bold mb-3">Kitchen Address</h5>
              <p className="text-muted mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                123, Pizza Street, Gourmet City,<br />
                Near central park, GC 45678
              </p>
            </Paper>

            <Paper variant="outlined" sx={{ p: 4, borderRadius: '20px', borderColor: 'var(--border-color)', bgcolor: 'background.paper' }}>
              <h5 className="fw-bold mb-3">Operating Hours</h5>
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.9rem' }}>
                <span className="text-muted">Monday - Thursday</span>
                <span className="fw-semibold">11:00 AM - 11:00 PM</span>
              </div>
              <div className="d-flex justify-content-between" style={{ fontSize: '0.9rem' }}>
                <span className="text-muted">Friday - Sunday</span>
                <span className="fw-semibold">11:00 AM - 01:00 AM</span>
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;