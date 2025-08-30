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
      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography variant="h1" component="h1" gutterBottom align="center" sx={{ mb: 2 }}>
          Welcome to Splendor
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary', fontSize: '1.1rem' }}>
          A Renaissance merchant adventure awaits
        </Typography>

        <Paper elevation={0} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h3" gutterBottom sx={{ mb: 3 }}>
            Enter Your Name
          </Typography>

          <TextField
            fullWidth
            label="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            sx={{ mb: 3 }}
            variant="outlined"
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCreateGame}
                disabled={!playerName.trim() || loading}
                sx={{ height: 56 }}
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
                sx={{ height: 56 }}
              >
                Join Game
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ mb: 2 }}>
            How to Play
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}>
            Splendor is a strategic card game where you play as Renaissance merchants trying to build
            the most prestigious jewelry business. Collect gems, purchase development cards, and
            attract nobles to earn prestige points.
          </Typography>

          <Typography variant="h4" gutterBottom sx={{ mb: 1 }}>
            Objective
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}>
            Be the first player to reach 15 prestige points to win the game!
          </Typography>

          <Typography variant="h4" gutterBottom sx={{ mb: 1 }}>
            Game Actions
          </Typography>
          <Box component="ul" sx={{
            pl: 3,
            '& li': {
              mb: 0.5,
              fontSize: '1.1rem',
              lineHeight: 1.6
            }
          }}>
            <li><strong>Take Gems:</strong> Take up to 3 different gems or 2 of the same type (if 4+ available)</li>
            <li><strong>Buy a Card:</strong> Purchase development cards using gems to gain permanent bonuses</li>
            <li><strong>Reserve a Card:</strong> Set aside a card for later purchase and gain a gold token</li>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;
