import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import LobbyPage from './pages/LobbyPage';
import InvitePage from './pages/InvitePage';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        `}
      </style>

      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', // Match the game background
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border
        }}
      >
        <Toolbar>
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              color: 'white',
              fontFamily: '"Cinzel", serif',
              fontWeight: 600,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', // Better text contrast
              letterSpacing: '0.02em'
            }}
          >
            Splendor
          </Typography>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="xl" 
        sx={{ 
          mt: 0, // Remove top margin to seamlessly connect with AppBar
          px: 0, // Remove horizontal padding since GamePage handles its own padding
          minHeight: 'calc(100vh - 64px)', // Fill remaining height (64px is AppBar height)
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lobby/:gameId" element={<LobbyPage />} />
          <Route path="/game/:gameId" element={<GamePage />} />
          <Route path="/invite/:gameId" element={<InvitePage />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;
