import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import FoodCard from '../components/FoodCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const categories = [
  { name: 'All Menu', value: '' },
  { name: '🍛 Indian Hits', value: 'combos' },
  { name: '🍕 Pizza', value: 'pizza' },
  { name: '🍔 Burgers', value: 'burgers' },
  { name: '🍜 Noodles / Wok', value: 'noodles' },
  { name: '🥟 Chinese', value: 'chinese' },
  { name: '🍲 Japanese', value: 'ramen-bento' },
  { name: '🍝 Pasta / Italian', value: 'pasta' },
  { name: '🍱 Sushi / Asian', value: 'sushi' },
  { name: '🌮 Mexican Tacos', value: 'tacos' },
  { name: '🌯 Wraps / Rolls', value: 'wraps' },
  { name: '🥗 Salads / Bowls', value: 'salads' },
  { name: '🍖 BBQ & Grills', value: 'grills' },
  { name: '🍟 Sides', value: 'sides' },
  { name: '🥤 Beverages', value: 'beverages' },
  { name: '🍰 Desserts', value: 'desserts' },
];

const Menu = () => {
  const { category: urlCategory } = useParams();
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [vegFilter, setVegFilter] = useState(''); // '' | 'true' | 'false'
  const [sort, setSort] = useState('popular'); // 'popular' | 'priceLowHigh' | 'priceHighLow' | 'rating'

  // Sync state with URL category if present
  const currentCategory = urlCategory || '';

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const params = {};
      if (currentCategory) params.category = currentCategory;
      if (vegFilter) params.isVeg = vegFilter;
      if (search) params.search = search;
      if (sort) params.sort = sort;

      const { data } = await api.get('/api/foods', { params });
      setFoods(data);
    } catch (err) {
      console.error('Error fetching foods:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [currentCategory, vegFilter, search, sort]);

  const handleCategoryChange = (val) => {
    if (val === '') {
      navigate('/menu');
    } else {
      navigate(`/menu/${val}`);
    }
  };

  return (
    <div className="container py-5 fade-in">
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-2">Our Culinary Masterpieces</h1>
        <p className="text-muted">Freshly prepared premium meals tailored to your tastebuds</p>
      </div>

      {/* Filters & Search Row */}
      <div className="row gy-3 align-items-center mb-5">
        {/* Search */}
        <div className="col-12 col-md-4">
          <TextField
            fullWidth
            label="Search pizza, burger, sides..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ bgcolor: 'background.paper', borderRadius: '10px' }}
          />
        </div>

        {/* Veg / Non-Veg Toggle */}
        <div className="col-12 col-sm-6 col-md-4 text-center">
          <ToggleButtonGroup
            value={vegFilter}
            exclusive
            onChange={(e, val) => setVegFilter(val !== null ? val : '')}
            sx={{ bgcolor: 'background.paper' }}
          >
            <ToggleButton value="" sx={{ px: 3, fontWeight: 600 }}>All</ToggleButton>
            <ToggleButton value="true" sx={{ px: 3, color: 'success.main', fontWeight: 600 }}>🟢 Veg</ToggleButton>
            <ToggleButton value="false" sx={{ px: 3, color: 'error.main', fontWeight: 600 }}>🔴 Non-Veg</ToggleButton>
          </ToggleButtonGroup>
        </div>

        {/* Sort Select */}
        <div className="col-12 col-sm-6 col-md-4">
          <FormControl fullWidth sx={{ bgcolor: 'background.paper', borderRadius: '10px' }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sort}
              label="Sort By"
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="popular">Popularity / Recommended</MenuItem>
              <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
              <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
              <MenuItem value="rating">Highest Rating</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Category Pills Slider/Row */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          overflowX: 'auto',
          pb: 2,
          mb: 4,
          '::-webkit-scrollbar': { height: '6px' },
        }}
      >
        {categories.map((cat, idx) => {
          const isSelected = currentCategory === cat.value;
          return (
            <button
              key={idx}
              onClick={() => handleCategoryChange(cat.value)}
              className={`btn px-4 py-2 text-nowrap rounded-pill ${
                isSelected ? 'btn-orange' : 'btn-orange-outline'
              }`}
              style={{
                fontSize: '0.9rem',
                borderWidth: isSelected ? '0' : '2px',
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </Box>

      {/* Food Grid */}
      {loading ? (
        <LoadingSpinner message="Searching the kitchen..." />
      ) : foods.length === 0 ? (
        <div className="text-center py-5">
          <span style={{ fontSize: '4rem' }}>😢</span>
          <h3 className="fw-bold mt-3">No Food Found</h3>
          <p className="text-muted">Try adjusting your filters or search keywords</p>
        </div>
      ) : (
        <div className="row g-4">
          {foods.map((food) => (
            <div key={food._id} className="col-12 col-sm-6 col-lg-3">
              <FoodCard food={food} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;