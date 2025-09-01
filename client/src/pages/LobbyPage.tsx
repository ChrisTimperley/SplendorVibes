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
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { ContentCopy, Share, ExitToApp } from '@mui/icons-material';
import { Game, GameState } from '../../../shared/types/game';
import { gameService } from '../services/gameService';

const LobbyPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [endGameDialogOpen, setEndGameDialogOpen] = useState(false);
  const [isEndingGame, setIsEndingGame] = useState(false);

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

  const copyInviteLink = async () => {
    if (!gameId) return;
    
    const inviteLink = `${window.location.origin}/invite/${gameId}`;
    
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopySuccess(true);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
    }
  };

  const handleCopySnackbarClose = () => {
    setCopySuccess(false);
  };

  const handleEndGame = async () => {
    if (!gameId) {
      return;
    }
    
    // Get current player ID from localStorage
    let currentPlayerId = localStorage.getItem('currentPlayerId');
    
    // If no currentPlayerId in localStorage, use the first player as fallback
    if (!currentPlayerId && game?.players && game.players.length > 0) {
      currentPlayerId = game.players[0].id;
    }
    
    if (!currentPlayerId) {
      console.error('No current player ID found');
      return;
    }
    
    setIsEndingGame(true);
    try {
      await gameService.endGame(gameId, currentPlayerId);
      navigate('/');
    } catch (error) {
      console.error('Error ending game:', error);
      // TODO: Show error message to user
    } finally {
      setIsEndingGame(false);
      setEndGameDialogOpen(false);
    }
  };

  const openEndGameDialog = () => {
    setEndGameDialogOpen(true);
  };

  const closeEndGameDialog = () => {
    setEndGameDialogOpen(false);
  };

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ color: 'white' }}
              >
                Game ID:
              </Typography>
              <Chip 
                label={game.id} 
                variant="outlined" 
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
              />
              <Tooltip title="Copy invite link">
                <IconButton 
                  onClick={copyInviteLink}
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <ContentCopy />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={copyInviteLink}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                mb: 2,
                '&:hover': {
                  borderColor: '#FFD700',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                }
              }}
            >
              Copy Invite Link
            </Button>
            
            <Typography 
              variant="body1" 
              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Share this link with other players to let them join instantly
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

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ExitToApp />}
                onClick={openEndGameDialog}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: '#ff4444',
                    backgroundColor: 'rgba(255, 68, 68, 0.1)',
                  }
                }}
              >
                End Game
              </Button>

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
          </Box>
        </Paper>
      </Box>
      
      {/* End Game Confirmation Dialog */}
      <Dialog
        open={endGameDialogOpen}
        onClose={closeEndGameDialog}
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          End Game
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Are you sure you want to end this game? This action cannot be undone and will disconnect all players.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={closeEndGameDialog} 
            sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEndGame}
            disabled={isEndingGame}
            sx={{ 
              color: '#ff4444',
              '&:hover': {
                backgroundColor: 'rgba(255, 68, 68, 0.1)'
              }
            }}
          >
            {isEndingGame ? 'Ending...' : 'End Game'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Copy success snackbar */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={handleCopySnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCopySnackbarClose} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Invite link copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LobbyPage;
