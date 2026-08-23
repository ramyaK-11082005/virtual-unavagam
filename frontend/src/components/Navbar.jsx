import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useThemeContext } from '../context/ThemeContext.jsx';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { themeMode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path) => (location.pathname === path ? 'active text-warning font-weight-bold' : '');

  // Dynamic text color style for nav links based on theme mode
  const linkStyle = {
    color: themeMode === 'dark' ? '#f8f9fa' : '#212121',
    transition: 'color 0.2s ease',
  };

  return (
    <nav className="navbar navbar-expand-lg glass-nav sticky-top py-3">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ color: 'var(--primary-orange)', fontWeight: '800', fontSize: '1.5rem' }}>
          <span className="me-2" style={{ fontSize: '1.8rem' }}>🍕</span>
          Virtual Unavagam
        </Link>

        {/* Mobile Hamburger trigger & Cart Icon (Visible on mobile) */}
        <div className="d-flex align-items-center d-lg-none">
          <IconButton onClick={() => navigate('/cart')} color="primary" className="me-2">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={toggleTheme} className="me-2" style={{ color: 'var(--primary-orange)' }}>
            {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <button
            className="navbar-toggler border-0 p-1"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'var(--text-color)' }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Main Navbar Collapse */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 text-center">
            <li className="nav-item px-2">
              <Link className={`nav-link text-uppercase font-weight-bold ${isActive('/')}`} to="/" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className={`nav-link text-uppercase font-weight-bold ${isActive('/menu')}`} to="/menu" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                Menu
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className={`nav-link text-uppercase font-weight-bold ${isActive('/about')}`} to="/about" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
            </li>
            <li className="nav-item px-2">
              <a className="nav-link text-uppercase font-weight-bold" href="/#why-us" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                Why Us
              </a>
            </li>
            <li className="nav-item px-2">
              <Link className={`nav-link text-uppercase font-weight-bold ${isActive('/faq')}`} to="/faq" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className={`nav-link text-uppercase font-weight-bold ${isActive('/contact')}`} to="/contact" style={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>

          {/* Desktop Right Side Controls */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <IconButton onClick={toggleTheme} style={{ color: 'var(--primary-orange)' }}>
              {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            <IconButton onClick={() => navigate('/cart')} color="primary">
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {user ? (
              <div className="d-flex align-items-center">
                <span className="me-2 fw-semibold" style={{ color: themeMode === 'dark' ? '#f8f9fa' : '#6c757d' }}>
                  Hi, {user.name.split(' ')[0]}
                </span>
                <IconButton onClick={handleMenuOpen} color="primary">
                  <AccountCircleIcon fontSize="large" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 3,
                    style: { borderRadius: '15px', marginTop: '10px' },
                  }}
                >
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>Profile</MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/orders'); }}>My Orders</MenuItem>
                  <MenuItem onClick={handleLogout} className="text-danger">Logout</MenuItem>
                </Menu>
              </div>
            ) : (
              <Link to="/login" className="btn btn-orange btn-sm text-uppercase">
                Login / Register
              </Link>
            )}
          </div>

          {/* Mobile Right Side Controls inside Hamburger */}
          {mobileMenuOpen && (
            <div className="d-lg-none text-center py-3 border-top mt-3">
              {user ? (
                <div>
                  <h6 className="fw-semibold mb-3" style={{ color: themeMode === 'dark' ? '#f8f9fa' : '#212121' }}>
                    Hi, {user.name}
                  </h6>
                  <div className="d-flex flex-column gap-2 px-4">
                    <button className="btn btn-orange-outline btn-sm text-uppercase" onClick={() => { setMobileMenuOpen(false); navigate('/profile'); }}>
                      Profile
                    </button>
                    <button className="btn btn-orange-outline btn-sm text-uppercase" onClick={() => { setMobileMenuOpen(false); navigate('/orders'); }}>
                      My Orders
                    </button>
                    <button className="btn btn-danger btn-sm text-uppercase mt-2" onClick={() => { setMobileMenuOpen(false); handleLogout(); }}>
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="btn btn-orange text-uppercase px-5" onClick={() => setMobileMenuOpen(false)}>
                  Login / Register
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;