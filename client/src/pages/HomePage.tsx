import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Grid
} from '@mui/material';
import { gameService } from '../services/gameService';

const HomePage: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    if (!playerName.trim()) return;

    setLoading(true);
    try {
      const result = await gameService.createGame(playerName);
      // Store the player ID for this session
      localStorage.setItem('currentPlayerId', result.playerId);
      navigate(`/lobby/${result.game.id}`);
    } catch (error) {
      console.error('Error creating game:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async (gameId: string) => {
    if (!playerName.trim()) return;

    setLoading(true);
    try {
      const result = await gameService.joinGame(gameId, playerName);
      // Store the player ID for this session
      localStorage.setItem('currentPlayerId', result.playerId);
      navigate(`/lobby/${gameId}`);
    } catch (error) {
      console.error('Error joining game:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Welcome to Splendor
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Enter Your Name
          </Typography>

          <TextField
            fullWidth
            label="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            margin="normal"
            variant="outlined"
          />

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCreateGame}
                disabled={!playerName.trim() || loading}
              >
                Create New Game
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                disabled={!playerName.trim() || loading}
                onClick={() => {
                  const gameId = prompt('Enter Game ID:');
                  if (gameId) handleJoinGame(gameId);
                }}
              >
                Join Game
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            How to Play Splendor
          </Typography>
          <Typography variant="body1" paragraph>
            Splendor is a strategic card game where you play as Renaissance merchants trying to build
            the most prestigious jewelry business. Collect gems, purchase development cards, and
            attract nobles to earn prestige points.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Objective
          </Typography>
          <Typography variant="body1" paragraph>
            Be the first player to reach 15 prestige points to win the game!
          </Typography>

          <Typography variant="h6" gutterBottom>
            Game Actions
          </Typography>
          <ul>
            <li><strong>Take Gems:</strong> Take up to 3 different gems or 2 of the same type (if 4+ available)</li>
            <li><strong>Buy a Card:</strong> Purchase development cards using gems to gain permanent bonuses</li>
            <li><strong>Reserve a Card:</strong> Set aside a card for later purchase and gain a gold token</li>
          </ul>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;
