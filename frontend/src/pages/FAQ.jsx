import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const questions = [
  {
    q: 'How long does delivery take?',
    a: 'We usually deliver within 30 to 45 minutes of order confirmation, depending on your distance from our kitchen hubs.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Cash on Delivery, UPI (Google Pay, PhonePe), and major credit/debit cards.',
  },
  {
    q: 'Is there a minimum order amount?',
    a: 'No, there is no minimum order amount! However, we offer free shipping/delivery discounts on orders above ₹500.',
  },
  {
    q: 'Are your cheeses pasteurized?',
    a: 'Yes, 100%! We only use premium quality pasteurized mozzarella, cheddar, and swiss cheese.',
  },
  {
    q: 'Can I change my delivery address after placing an order?',
    a: 'If your order status is still "Pending" or "Confirmed", you can contact support immediately to update details. Once it enters "Preparing", updates might not be possible.',
  },
];

const FAQ = () => {
  return (
    <div className="container py-5 fade-in text-start" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted">Find answers to common questions about our food prep and logistics</p>
      </div>

      <div className="d-flex flex-column gap-3">
        {questions.map((item, idx) => (
          <Accordion
            key={idx}
            disableGutters
            sx={{
              p: 1,
              borderRadius: '16px !important',
              borderColor: 'var(--border-color)',
              borderWidth: '1px',
              borderStyle: 'solid',
              bgcolor: 'background.paper',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {item.q}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: '1.7' }}>
                {item.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
