import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout & Contexts
import MainLayout from './layouts/MainLayout.jsx';
import { ThemeContextProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

// Components
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import FoodDetails from './pages/FoodDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import LoginRegister from './pages/LoginRegister.jsx';
import Profile from './pages/Profile.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import FAQ from './pages/FAQ.jsx';

function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Router>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/menu/:category" element={<Menu />} />
                  <Route path="/product/:id" element={<FoodDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<LoginRegister />} />
                  <Route path="/register" element={<LoginRegister />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  
                  {/* Protected Routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetails />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </MainLayout>
            </Router>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;
