import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../services/api.js';
import FoodCard from '../components/FoodCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [password, setPassword] = useState('');
  
  const [stats, setStats] = useState({ totalOrders: 0, completedOrders: 0, pendingOrders: 0 });
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const fetchProfileAndStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/users/profile');
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone || '');
      setAddress(data.address || '');
      setStats(data.stats);
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load profile details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndStats();
  }, [user?.favorites]); // Refetch when favorites change (e.g. removed from favorite via card icon click)

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updateData = { name, email, phone, address };
      if (password) {
        updateData.password = password;
      }
      await updateProfile(updateData);
      setEditMode(false);
      setPassword('');
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Profile update failed', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Consulting account ledgers..." />;
  }

  return (
    <div className="container py-5 fade-in text-start">
      <h1 className="fw-bold mb-5">My Account</h1>

      <div className="row gy-4">
        {/* Profile Details & Stats */}
        <div className="col-12 col-lg-4">
          {/* Profile Card */}
          <Paper variant="outlined" sx={{ p: 4, borderRadius: '20px', textAlign: 'center', borderColor: 'var(--border-color)', bgcolor: 'background.paper', mb: 4 }}>
            <Box display="flex" justifyContent="center" mb={2}>
              <Avatar
                sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '3rem', fontWeight: 800 }}
              >
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {email}
            </Typography>

            <div className="row g-2 text-center border-top pt-3">
              <div className="col-4">
                <h6 className="fw-bold mb-0 text-primary">{stats.totalOrders}</h6>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Total</span>
              </div>
              <div className="col-4 border-start border-end">
                <h6 className="fw-bold mb-0 text-success">{stats.completedOrders}</h6>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Completed</span>
              </div>
              <div className="col-4">
                <h6 className="fw-bold mb-0 text-warning">{stats.pendingOrders}</h6>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Pending</span>
              </div>
            </div>
          </Paper>
        </div>

        {/* Edit profile / Detail info */}
        <div className="col-12 col-lg-8">
          <Paper variant="outlined" sx={{ p: 4, borderRadius: '20px', borderColor: 'var(--border-color)', bgcolor: 'background.paper' }}>
            <Box display="flex" justifyContent="between" alignItems="center" mb={4} className="border-bottom pb-2">
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Personal Information
              </Typography>
              <Button size="small" variant="outlined" color="primary" onClick={() => setEditMode(!editMode)}>
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>

            <form onSubmit={handleSave}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Default Delivery Address"
                    multiline
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={!editMode}
                  />
                </Grid>
                {editMode && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password (Leave blank to keep current)"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                )}
                {editMode && (
                  <Grid item xs={12}>
                    <button type="submit" className="btn btn-orange px-5 text-uppercase">
                      Save Changes
                    </button>
                  </Grid>
                )}
              </Grid>
            </form>
          </Paper>
        </div>
      </div>

      {/* Favorites List */}
      <div className="mt-5 border-top pt-5">
        <h3 className="fw-bold mb-4">My Favorites ❤️</h3>
        {favorites.length === 0 ? (
          <div className="text-center py-4 border rounded-4" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <span style={{ fontSize: '3rem' }}>♡</span>
            <p className="text-muted mt-2 mb-0">No favorite foods added yet.</p>
          </div>
        ) : (
          <div className="row g-4">
            {favorites.map((food) => (
              <div key={food._id} className="col-12 col-sm-6 col-lg-3">
                <FoodCard food={food} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
