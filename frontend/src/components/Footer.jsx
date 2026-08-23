import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-5" style={{ backgroundColor: 'var(--deep-brown)', color: '#ffffff' }}>
      <div className="container">
        <div className="row gy-4">
          {/* Logo & Intro */}
          <div className="col-12 col-md-4">
            <h4 className="fw-bold mb-3 d-flex align-items-center" style={{ color: 'var(--primary-orange)' }}>
              <span className="me-2">🍕</span> Virtual Unavagam
            </h4>
            <p className="text-white-50" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Freshly baked happiness, delivered to your door. Indulge in our range of artisanal pizzas, delicious burgers, sides, and more.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="/contact" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="/contact" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="/contact" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="/contact" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-2 offset-md-1">
            <h6 className="text-uppercase fw-bold mb-3" style={{ color: 'var(--primary-orange)' }}>Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '0.9rem' }}>
              <li><Link to="/" className="text-white-50 text-decoration-none hover-white">Home</Link></li>
              <li><Link to="/menu" className="text-white-50 text-decoration-none hover-white">Menu</Link></li>
              <li><Link to="/about" className="text-white-50 text-decoration-none hover-white">About Us</Link></li>
              <li><Link to="/faq" className="text-white-50 text-decoration-none hover-white">FAQs</Link></li>
              <li><Link to="/contact" className="text-white-50 text-decoration-none hover-white">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="col-6 col-md-2">
            <h6 className="text-uppercase fw-bold mb-3" style={{ color: 'var(--primary-orange)' }}>Support</h6>
            <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '0.9rem' }}>
              <li><Link to="/profile" className="text-white-50 text-decoration-none hover-white">My Account</Link></li>
              <li><Link to="/orders" className="text-white-50 text-decoration-none hover-white">Track Order</Link></li>
              <li><Link to="/cart" className="text-white-50 text-decoration-none hover-white">View Cart</Link></li>
              <li><a href="/about" className="text-white-50 text-decoration-none hover-white">Privacy Policy</a></li>
              <li><a href="/about" className="text-white-50 text-decoration-none hover-white">Terms of Use</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-12 col-md-3">
            <h6 className="text-uppercase fw-bold mb-3" style={{ color: 'var(--primary-orange)' }}>Contact Us</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-white-50" style={{ fontSize: '0.9rem' }}>
              <li className="d-flex align-items-start gap-2">
                <i className="fas fa-map-marker-alt mt-1 text-white"></i>
                <span>123, Pizza Street, Gourmet City, GC 45678</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="fas fa-phone-alt text-white"></i>
                <span>+91 88079 XXXXXX</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="fas fa-envelope text-white"></i>
                <span>support@unavagam.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
          <p className="mb-0 text-white-50">&copy; {new Date().getFullYear()} Virtual Unavagam. All rights reserved.</p>
          <p className="mb-0 text-white-50">
            Made with <i className="fas fa-heart text-danger"></i> for delicious meals.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
