import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const LoadingSpinner = ({ fullPage = false, message = 'Preparing deliciousness...' }) => {
  const content = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={3}
    >
      <Box
        sx={{
          fontSize: '48px',
          animation: 'float 2s ease-in-out infinite',
          mb: 2,
        }}
      >
        🍕
      </Box>
      <CircularProgress color="primary" size={50} thickness={4} />
      <Typography variant="body1" sx={{ mt: 2, fontWeight: 500, color: 'text.secondary' }}>
        {message}
      </Typography>
    </Box>
  );

  if (fullPage) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'background.default',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingSpinner;
