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
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Game Lobby
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Game ID: <Chip label={game.id} variant="outlined" />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Share this ID with other players to let them join
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          Players ({game.players.length}/4)
        </Typography>

        <Paper variant="outlined" sx={{ mb: 3 }}>
          <List>
            {game.players.map((player, index) => (
              <ListItem key={player.id}>
                <ListItemText
                  primary={player.name}
                  secondary={index === 0 ? 'Host' : 'Player'}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" color="text.secondary">
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
            >
              Start Game
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default LobbyPage;
