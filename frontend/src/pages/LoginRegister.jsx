import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const LoginRegister = () => {
  const { login, register, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(location.pathname === '/register');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Field validation errors
  const [errors, setErrors] = useState({});

  // Sync state if pathname changes
  useEffect(() => {
    setIsRegister(location.pathname === '/register');
  }, [location.pathname]);

  // Redirect target
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const validateEmail = (val) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = 'Enter email';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Enter password';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      setSubmitting(true);
      await login(email, password);
      showToast('Welcome back! Login successful. 🍕', 'success');
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name) newErrors.name = 'Full name is required';
    if (!email) newErrors.email = 'Enter email';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      setSubmitting(true);
      await register(name, email, password, phone, address);
      showToast('Registration successful! Welcome to the family. 🎉', 'success');
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !validateEmail(forgotEmail)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    showToast(`Password reset link sent to ${forgotEmail}! 📬`, 'success');
    setForgotOpen(false);
    setForgotEmail('');
  };

  const toggleMode = (targetRegister) => {
    setIsRegister(targetRegister);
    setErrors({});
    navigate(targetRegister ? '/register' : '/login', { replace: true, state: location.state });
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center fade-in" style={{ minHeight: '75vh' }}>
      <div
        className="card shadow-lg border-0 rounded-4 overflow-hidden w-100"
        style={{
          maxWidth: '850px',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div className="row g-0">
          {/* Animated Mascot / Cover Column */}
          <div
            className="col-12 col-md-5 d-flex flex-column align-items-center justify-content-center p-5 text-white text-center"
            style={{
              background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-orange-hover) 100%)',
            }}
          >
            <div className="float-animation mb-3" style={{ fontSize: '6rem', userSelect: 'none' }}>
              🍕
            </div>
            <h3 className="fw-extrabold mb-2 text-white">
              {isRegister ? 'Join Unavagam!' : 'Welcome Back!'}
            </h3>
            <p className="small text-white-50 mb-4" style={{ maxWidth: '240px' }}>
              {isRegister
                ? 'Register now to order customized food and save favorites.'
                : 'Login to track orders and retrieve your saved profile.'}
            </p>
            <button
              onClick={() => toggleMode(!isRegister)}
              className="btn btn-outline-light rounded-pill px-4 text-uppercase fw-bold"
              style={{ fontSize: '0.85rem' }}
            >
              {isRegister ? 'I have an account' : 'Create an account'}
            </button>
          </div>

          {/* Form Content Column */}
          <div className="col-12 col-md-7 p-4 p-sm-5 text-start">
            {!isRegister ? (
              <form onSubmit={handleLoginSubmit} className="fade-in">
                <h3 className="fw-bold mb-4">Login</h3>
                
                <div className="mb-3">
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    required
                  />
                </div>

                <div className="mb-2">
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                <div className="d-flex justify-content-end mb-4">
                  <button
                    type="button"
                    onClick={() => setForgotOpen(true)}
                    className="btn btn-link p-0 text-decoration-none"
                    style={{ fontSize: '0.85rem', color: 'var(--primary-orange)' }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" disabled={submitting} className="btn btn-orange w-100 py-3 text-uppercase mb-3 fw-bold">
                  {submitting ? 'Authenticating...' : 'Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="fade-in">
                <h3 className="fw-bold mb-4">Create Account</h3>

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <TextField
                      fullWidth
                      label="Full Name *"
                      variant="outlined"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: null });
                      }}
                      error={Boolean(errors.name)}
                      helperText={errors.name}
                      required
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <TextField
                      fullWidth
                      label="Email Address *"
                      variant="outlined"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                      error={Boolean(errors.email)}
                      helperText={errors.email}
                      required
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <TextField
                      fullWidth
                      label="Password *"
                      variant="outlined"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: null });
                      }}
                      error={Boolean(errors.password)}
                      helperText={errors.password}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <TextField
                      fullWidth
                      label="Confirm Password *"
                      variant="outlined"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                      }}
                      error={Boolean(errors.confirmPassword)}
                      helperText={errors.confirmPassword}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                  <div className="col-12">
                    <TextField
                      fullWidth
                      label="Phone Number"
                      variant="outlined"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <TextField
                      fullWidth
                      label="Delivery Address"
                      variant="outlined"
                      multiline
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="btn btn-orange w-100 py-3 text-uppercase mt-4 fw-bold">
                  {submitting ? 'Creating Account...' : 'Register'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 2,
            maxWidth: '400px',
            bgcolor: 'background.paper',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Reset Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your account email address and we will send a password reset verification link.
          </Typography>
          <TextField
            fullWidth
            label="Account Email"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setForgotOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleForgotSubmit} variant="contained" color="primary">
            Send Link
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LoginRegister;
