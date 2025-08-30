import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import LobbyPage from './pages/LobbyPage';

const App: React.FC = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Splendor Board Game
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lobby/:gameId" element={<LobbyPage />} />
          <Route path="/game/:gameId" element={<GamePage />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
