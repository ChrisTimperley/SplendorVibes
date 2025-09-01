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
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'transparent', // Use the body background
        py: 4,
        px: 2
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mt: 3, mb: 3 }}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 2,
              color: 'white',
              fontFamily: '"Cinzel", serif',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            Welcome to Splendor
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              mb: 4, 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '1.1rem' 
            }}
          >
            A Renaissance merchant adventure awaits
          </Typography>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 3,
              background: 'rgba(0, 0, 0, 0.6)', // Increased opacity for better contrast
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)', // Increased border opacity
              borderRadius: 2
            }}
          >
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                mb: 3,
                color: 'white',
                fontFamily: '"Cinzel", serif'
              }}
            >
              Enter Your Name
            </Typography>

          <TextField
            fullWidth
            label="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Add background for visibility
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                },
                '& input': {
                  color: 'white', // Ensure input text is white
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                  }
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#FFD700',
                },
                '&.MuiInputLabel-shrink': {
                  color: 'rgba(255, 255, 255, 0.9)', // Make floating label more visible
                },
              },
            }}
            variant="outlined"
            placeholder="Enter your name here"
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCreateGame}
                disabled={!playerName.trim() || loading}
                sx={{ 
                  height: 56,
                  background: 'linear-gradient(135deg, #DAA520 0%, #FFD700 100%)',
                  color: '#000',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                  },
                  '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
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
                sx={{ 
                  height: 56,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                  '&:disabled': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                Join Game
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper 
          elevation={0} 
          sx={{ 
            p: 4,
            background: 'rgba(0, 0, 0, 0.6)', // Increased opacity for better contrast
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)', // Increased border opacity
            borderRadius: 2
          }}
        >
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              mb: 2,
              color: 'white',
              fontFamily: '"Cinzel", serif'
            }}
          >
            How to Play
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ 
              mb: 3, 
              fontSize: '1.1rem', 
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            Splendor is a strategic card game where you play as Renaissance merchants trying to build
            the most prestigious jewelry business. Collect gems, purchase development cards, and
            attract nobles to earn prestige points.
          </Typography>

          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              mb: 1,
              color: 'white',
              fontFamily: '"Cinzel", serif'
            }}
          >
            Objective
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ 
              mb: 3, 
              fontSize: '1.1rem', 
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            Be the first player to reach 15 prestige points to win the game!
          </Typography>

          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              mb: 1,
              color: 'white',
              fontFamily: '"Cinzel", serif'
            }}
          >
            Game Actions
          </Typography>
          <Box component="ul" sx={{
            pl: 3,
            '& li': {
              mb: 0.5,
              fontSize: '1.1rem',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.9)'
            }
          }}>
            <li><strong>Take Gems:</strong> Take up to 3 different gems or 2 of the same type (if 4+ available)</li>
            <li><strong>Buy a Card:</strong> Purchase development cards using gems to gain permanent bonuses</li>
            <li><strong>Reserve a Card:</strong> Set aside a card for later purchase and gain a gold token</li>
          </Box>
        </Paper>
      </Box>
    </Container>
    </Box>
  );
};

export default HomePage;
