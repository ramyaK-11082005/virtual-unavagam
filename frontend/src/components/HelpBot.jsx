import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

const faqs = [
  {
    q: 'Why choose Virtual Unavagam?',
    a: 'We use 100% fresh, organic ingredients. Our dough is kneaded daily, and our sauces are homemade. Plus, we deliver sizzling hot in record time!',
  },
  {
    q: 'How can I order?',
    a: 'Browse our menu, add delicious food to your cart, click Checkout, enter your address, and place your order. It is that simple!',
  },
  {
    q: 'Do you provide delivery?',
    a: 'Yes! We deliver across the city with a standard delivery fee of ₹40. Orders above ₹500 get flat discounts!',
  },
  {
    q: 'Can I customize my pizza?',
    a: 'Yes, you can leave custom delivery/cooking requests during checkout, or reach out to us directly via our customer support hotline.',
  },
  {
    q: 'How can I track my order?',
    a: 'Once logged in, go to "My Orders" from your profile menu. Click "View Details" to see the real-time visual stepper tracking your food status!',
  },
];

const HelpBot = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="btn-orange float-animation"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(255, 122, 0, 0.4)',
          borderRadius: '50px',
          padding: '12px 20px',
        }}
      >
        <span>🍕</span>
        <span className="d-none d-sm-inline">Help Bot</span>
      </button>

      {/* Slide-out Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: '380px' },
            bgcolor: 'background.default',
            backgroundImage: 'none',
          },
        }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
              <img src="c:\Users\acer\Downloads\help_pizza_bot.png" alt="" />
                🍕 Unavagam Bot
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Hello! I am your Virtual Unavagam helper. How can I assist you today? Here are some FAQs:
          </Typography>

          {/* Accordion FAQs */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 3 }}>
            {faqs.map((faq, idx) => (
              <Accordion key={idx} disableGutters sx={{ mb: 1, border: '1px solid var(--border-color)', borderRadius: '10px !important', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          {/* Direct Support Contact */}
          <Box sx={{ borderTop: '1px solid var(--border-color)', pt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Still have questions?
            </Typography>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={() => { setOpen(false); window.location.href = 'mailto:support@unavagam.com'; }}
            >
              Contact Support
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default HelpBot;
