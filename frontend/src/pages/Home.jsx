import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import StarsIcon from '@mui/icons-material/Stars';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShieldIcon from '@mui/icons-material/Shield';
const categories = [
  { name: 'Indian Hits', icon: '🍛', category: 'combos' },
  { name: 'Pizza', icon: '🍕', category: 'pizza' },
  { name: 'Burgers', icon: '🍔', category: 'burgers' },
  { name: 'Noodles / Wok', icon: '🍜', category: 'noodles' },
  { name: 'Chinese ', icon: '🥟', category: 'chinese' },
  { name: 'Japanese', icon: '🍲', category: 'ramen-bento' },
  { name: 'Pasta / Italian', icon: '🍝', category: 'pasta' },
  { name: 'Sushi / Asian', icon: '🍱', category: 'sushi' },
  { name: 'Mexican Tacos', icon: '🌮', category: 'tacos' },
  { name: 'Wraps / Rolls', icon: '🌯', category: 'wraps' },
  { name: 'Salads / Bowls', icon: '🥗', category: 'salads' },
  { name: 'BBQ & Grills', icon: '🍖', category: 'grills' },
  { name: 'Sides', icon: '🍟', category: 'sides' },
  { name: 'Beverages', icon: '🥤', category: 'beverages' },
  { name: 'Desserts', icon: '🍰', category: 'desserts' },
];

const featuredFoods = [
  {
    title: 'Japanese Sushi Rolls',
    desc: 'Fresh Atlantic salmon, tuna, and avocado rolls prepared fresh daily by master sushi chefs.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    category: 'sushi',
  },
  {
    title: 'Italian Wood-Fired Pizza',
    desc: 'Hand-stretched crust baked over open wood flames with authentic San Marzano tomatoes and melted mozzarella.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    category: 'pizza',
  },
];

const whyUsItems = [
  { title: 'Fresh Ingredients', desc: '100% organic, kneaded daily.', icon: <StarsIcon color="primary" fontSize="large" /> },
  { title: 'Fast Delivery', desc: 'Sizzling hot to your doorstep.', icon: <DeliveryDiningIcon color="primary" fontSize="large" /> },
  { title: 'Made With Love', desc: 'Crafted by our expert food artisans.', icon: <FavoriteIcon color="primary" fontSize="large" /> },
  { title: 'Hygienic Prep', desc: 'Zero contact, kitchen sanitization.', icon: <CleanHandsIcon color="primary" fontSize="large" /> },
  { title: 'Customizable Food', desc: 'Adjust toppings, sizes, and sides.', icon: <AutoAwesomeIcon color="primary" fontSize="large" /> },
  { title: 'Quality Guaranteed', desc: 'Premium taste in every bite.', icon: <ShieldIcon color="primary" fontSize="large" /> },
];

const heroSlides = [
  {
    title: "World Flavors. Delivered Hot & Fresh.",
    subtitle: "From spicy Indian hits and wok-tossed noodles to Italian pasta, sushi, pizzas, and burgers. Satisfy your cravings instantly!",
    bg: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
    btnText: "Order Now",
    path: "/menu"
  },
  {
    title: "Japanese Sushi Rolls & Asian Wok.",
    subtitle: "Experience authentic high-heat stir-fry noodles, savory dumplings, and pristine sushi rolls made to perfection.",
    bg: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1920&q=80",
    btnText: "Explore Sushi",
    path: "/menu/sushi"
  },
  {
    title: "Italian Wood-Fired Pizzas.",
    subtitle: "Indulge in authentic cheesy Italian specialties crafted with original European herbs and fresh dough.",
    bg: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1920&q=80",
    btnText: "Explore Pizza",
    path: "/menu/pizza"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play Carousel Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fade-in">
      {/* React State-Powered Auto Carousel Hero Section */}
      <section
        style={{
          position: 'relative',
          height: '85vh',
          minHeight: '500px',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.38), rgba(0, 0, 0, 0.62)), url("${heroSlides[currentSlide].bg}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: '#ffffff',
          fontFamily:'Montserrat',
          transition: 'background-image 1s ease-in-out',
        }}
      >
        <div className="container text-center text-md-start">
          <div className="row align-items-center">
            <div className="col-12 col-md-8 col-lg-7">
              <h1 className="display-4 fw-extrabold mb-3 slide-in" style={{ fontWeight: 900, textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                {heroSlides[currentSlide].title.split('.')[0]}. <br />
                <span style={{ color: 'var(--primary-orange)' }}>{heroSlides[currentSlide].title.split('.')[1]}</span>
              </h1>
              <p className="lead mb-4" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)', fontSize: '1.15rem' }}>
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-md-start">
                <button onClick={() => navigate(heroSlides[currentSlide].path)} className="btn btn-orange btn-lg px-5 text-uppercase">
                  {heroSlides[currentSlide].btnText}
                </button>
                <button onClick={() => navigate('/menu')} className="btn btn-orange-outline btn-lg px-5 text-uppercase" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
                  Explore Menu
                </button>
              </div>
            </div>
            
            {/* Logo Accessory */}
            <div className="col-md-5 d-none d-md-flex align-items-center justify-content-center">
              <div className="float-animation" style={{ fontSize: '10rem', userSelect: 'none', fontWeight: 900, color: 'var(--primary-orange)' }}>
                VU
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators / Dots */}
        <div style={{ position: 'absolute', bottom: '20px', width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: currentSlide === idx ? '30px' : '10px',
                height: '10px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: currentSlide === idx ? 'var(--primary-orange)' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-5 container text-center">
        <h2 className="fw-bold mb-2">Explore Global Cuisines</h2>
        <p className="text-muted mb-4">Choose from our freshly prepared signature ranges across cultures</p>
        <div className="row g-3 justify-content-center">
          {categories.map((cat, idx) => (
            <div key={idx} className="col-6 col-md-4 col-lg-2">
              <div
                onClick={() => navigate(`/menu/${cat.category}`)}
                className="p-4 text-center cursor-pointer shadow-sm rounded-4"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = 'var(--primary-orange)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{cat.icon}</div>
                <h6 className="fw-bold mb-0">{cat.name}</h6>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Added Featured Food Section (Sushi & Pizza clearly visible) */}
      <section className="py-5 container">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2">Featured Global Specialties</h2>
          <p className="text-muted">Directly handpicked customer favorites</p>
        </div>
        <div className="row g-4">
          {featuredFoods.map((food, idx) => (
            <div key={idx} className="col-12 col-md-6">
              <div
                onClick={() => navigate(`/menu/${food.category}`)}
                className="card border-0 shadow-sm rounded-4 overflow-hidden h-100"
                style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
              >
                <div className="row g-0 h-100 align-items-center" style={{ background:' rgba(255, 133, 19, 0.12)'}}>
                  <div className="col-5">
                    <img src={food.image} alt={food.title} className="img-fluid h-100 w-100 object-fit-cover" style={{ minHeight: '220px'}} />
                  </div>
                  <div className="col-7">
                    <div className="card-body p-4">
                      <span className="badge bg-warning text-dark mb-2 fw-bold">Chef Special</span>
                      <h4 className="fw-bold mb-2">{food.title}</h4>
                      <p className="text-muted small mb-3">{food.desc}</p>
                      <button className="btn btn-sm btn-orange text-uppercase">Order Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Banner / Featured Combo */}
      <section className="py-5 text-dark" style={{ backgroundColor: 'rgba(255, 122, 0, 0.08)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-12 col-md-6 text-center text-md-start">
              <span className="badge bg-danger text-uppercase mb-2 fw-bold" style={{ fontSize: '0.8rem' }}>Global Fusion Box</span>
              <h2 className="fw-bold mb-3">Worldwide Feast Party Pack</h2>
              <p className="mb-4">Experience the best of both worlds: Spicy Hakka Noodles, Butter Chicken, a Wood-fired Pizza, and warm Chocolate Brownies.</p>
              <h3 className="fw-bold text-danger mb-4">₹899 <span className="fs-5 text-muted text-decoration-line-through">₹1299</span></h3>
              <button onClick={() => navigate('/menu/combos')} className="btn btn-orange text-uppercase px-4 py-2.5">
                Claim Global Combo
              </button>
            </div>
            <div className="col-12 col-md-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
                alt="Global feast spread"
                className="img-fluid rounded-4 shadow"
                style={{ maxHeight: '350px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-5 container text-center">
        <h2 className="fw-bold mb-2">Why Choose Us?</h2>
        <p className="text-muted mb-5">We ensure the highest hygiene standards and premium quality ingredients</p>
        <Grid container spacing={3}>
          {whyUsItems.map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  bgcolor: 'background.paper',
                  borderColor: 'var(--border-color)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(255, 122, 0, 0.08)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>{item.icon}</Box>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </section>
    </div>
  );
};

Home.displayName = 'Home';

export default Home;