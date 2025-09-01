import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip
} from '@mui/material';
import { Game, GameState } from '../../../shared/types/game';
import { gameService } from '../services/gameService';

const LobbyPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gameId) return;

    const fetchGame = async () => {
      try {
        const gameData = await gameService.getGame(gameId);
        setGame(gameData);
      } catch (error) {
        console.error('Error fetching game:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();

    // Poll for game updates every 2 seconds
    const interval = setInterval(fetchGame, 2000);

    return () => clearInterval(interval);
  }, [gameId, navigate]);

  useEffect(() => {
    if (game && game.state === GameState.IN_PROGRESS) {
      navigate(`/game/${gameId}`);
    }
  }, [game, gameId, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (!game) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography variant="h6">Game not found</Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'transparent', // Use the body background
        py: 4,
        px: 2
      }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              color: 'white',
              fontFamily: '"Cinzel", serif',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            Game Lobby
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ color: 'white' }}
            >
              Game ID: <Chip 
                label={game.id} 
                variant="outlined" 
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
              />
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Share this ID with other players to let them join
            </Typography>
          </Box>

          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ color: 'white' }}
          >
            Players ({game.players.length}/4)
          </Typography>

          <Paper 
            variant="outlined" 
            sx={{ 
              mb: 3,
              background: 'rgba(0, 0, 0, 0.2)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <List>
              {game.players.map((player, index) => (
                <ListItem key={player.id}>
                  <ListItemText
                    primary={player.name}
                    secondary={index === 0 ? 'Host' : 'Player'}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: 'white'
                      },
                      '& .MuiListItemText-secondary': {
                        color: 'rgba(255, 255, 255, 0.6)'
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography 
              variant="body1" 
              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              {game.players.length < 2
                ? 'Waiting for at least 2 players to start...'
                : game.state === GameState.WAITING_FOR_PLAYERS
                  ? 'Ready to start!'
                  : 'Game in progress...'
              }
            </Typography>

            {game.players.length >= 2 && game.state === GameState.WAITING_FOR_PLAYERS && (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(`/game/${gameId}`)}
                sx={{
                  background: 'linear-gradient(135deg, #DAA520 0%, #FFD700 100%)',
                  color: '#000',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                  }
                }}
              >
                Start Game
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LobbyPage;
