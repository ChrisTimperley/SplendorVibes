import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  DialogContentText,
  Button, 
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { Game, GameState } from '../../../shared/types/game';
import { gameService } from '../services/gameService';
import { socketService } from '../services/socketService';
import GameBoard from '../components/GameBoard';
import PlayerArea from '../components/PlayerArea';
import GameActions from '../components/GameActions';
import { colors, borderRadius } from '../theme';

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [endGameDialogOpen, setEndGameDialogOpen] = useState(false);
  const [isEndingGame, setIsEndingGame] = useState(false);
  const [gameTerminatedDialog, setGameTerminatedDialog] = useState(false);

  useEffect(() => {
    if (!gameId) return;

    const initializeGame = async () => {
      try {
        const gameData = await gameService.getGame(gameId);
        setGame(gameData);

        // Get the current player ID from localStorage
        const storedPlayerId = localStorage.getItem('currentPlayerId');
        const playerId = storedPlayerId || gameData.players[0]?.id || 'demo-player';

        if (!storedPlayerId) {
          console.error('No player ID found in localStorage, using fallback');
        }

        setCurrentPlayer(playerId);

        // Initialize socket connection
        socketService.connect();
        socketService.joinGame(gameId, playerId);

        // Listen for game updates
        socketService.onGameStateUpdate((updatedGame: Game) => {
          setGame(updatedGame);
          
          // Check if game was terminated
          if (updatedGame.state === GameState.FINISHED && updatedGame.endReason === 'terminated') {
            if (updatedGame.endedBy !== currentPlayer) {
              // Show dialog for players who didn't end the game
              setGameTerminatedDialog(true);
            } else {
              // Navigate to home for the player who ended the game
              navigate('/');
            }
          }
        });

      } catch (error) {
        console.error('Error initializing game:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeGame();

    return () => {
      socketService.disconnect();
    };
  }, [gameId]);

  // Check for game completion
  useEffect(() => {
    if (game && game.state === GameState.FINISHED && !showGameOverDialog) {
      setShowGameOverDialog(true);
    }
  }, [game, showGameOverDialog]);

  const handleGameAction = async (action: string, payload: any) => {
    if (!game || !gameId || !currentPlayer) return;
    
    // Prevent actions if game is finished
    if (game.state === GameState.FINISHED) {
      return;
    }

    try {
      // Add playerId to all payloads
      const payloadWithPlayer = {
        ...payload,
        playerId: currentPlayer
      };
      socketService.sendGameAction(gameId, action, payloadWithPlayer);

      // Clear selected tokens after taking them
      if (action === 'take-tokens') {
        setSelectedTokens({});
      }
    } catch (error) {
      console.error('Error sending game action:', error);
    }
  };

  const handlePurchaseReservedCard = async (cardId: string) => {
    await handleGameAction('purchase-reserved-card', { cardId });
  };

  const handleCloseGameOverDialog = () => {
    setShowGameOverDialog(false);
  };

  const handleEndGame = async () => {
    if (!gameId || !currentPlayer) return;
    
    setIsEndingGame(true);
    try {
      // Use socket system to ensure all players get notified
      socketService.sendGameAction(gameId, 'end-game', { playerId: currentPlayer });
      // Navigation will happen when socket update comes back
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

  const handleGameTerminatedClose = () => {
    setGameTerminatedDialog(false);
    navigate('/');
  };

  const isPlayerWinner = (playerId: string): boolean => {
    return game?.winner?.id === playerId;
  };

  const getGameOverMessage = (): string => {
    if (!game?.winner) return 'Game Over';
    if (isPlayerWinner(currentPlayer || '')) {
      return 'Congratulations! You Won!';
    } else {
      return `Game Over - ${game.winner.name} Wins!`;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography variant="h6">Loading game...</Typography>
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
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'grid',
        gridTemplateColumns: '1fr 280px', // Reduced from 320px
        gap: 2, // Reduced from 3
        p: 1.5, // Reduced from 2
        '@media (max-width: 1200px)': {
          gridTemplateColumns: '1fr',
          gap: 2,
        }
      }}
    >
      {/* Main Game Area */}
      <Box sx={{ minWidth: 0 }}>
        <GameBoard
          board={game.board}
          onCardAction={game.state === GameState.FINISHED ? () => {} : handleGameAction}
          selectedTokens={selectedTokens}
          onTokenSelectionChange={game.state === GameState.FINISHED ? () => {} : setSelectedTokens}
        />
      </Box>

      {/* Sticky Player Sidebar */}
      <Box
        sx={{
          position: 'sticky',
          top: 12, // Reduced from 16
          height: 'fit-content',
          background: 'rgba(0, 0, 0, 0.6)', // Increased opacity for better contrast
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.2)', // Increased border opacity
          p: 1.5, // Reduced from 2
          backdropFilter: 'blur(8px)', // Added blur for better visual separation
          '@media (max-width: 1200px)': {
            position: 'static',
            order: -1,
          }
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'white',
            mb: 1.5, // Reduced from 2
            fontSize: '1rem', // Reduced from 1.1rem
            textAlign: 'center',
          }}
        >
          Players
        </Typography>

        {/* All Players */}
        {game.players.map((player, index) => (
          <Box key={player.id} sx={{ mb: 1.5 }}> {/* Reduced from 2 */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: player.id === currentPlayer ? 'gold' : 'white',
                mb: 0.75, // Reduced from 1
                fontSize: '0.9rem', // Reduced from 0.95rem
              }}
            >
              {player.id === currentPlayer ? 'You: ' : ''}{player.name}
              {game.currentPlayerIndex === index ? ' (Current Turn)' : ''}
            </Typography>

            <PlayerArea
              player={player}
              isCurrentPlayer={game.currentPlayerIndex === index}
              onPurchaseReservedCard={player.id === currentPlayer ? handlePurchaseReservedCard : undefined}
            />
          </Box>
        ))}

        {/* End Game Button */}
        {game.state !== GameState.FINISHED && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Tooltip title="End this game for all players">
              <Button
                variant="outlined"
                startIcon={<ExitToApp />}
                onClick={openEndGameDialog}
                fullWidth
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
            </Tooltip>
          </Box>
        )}

        {/* Game Actions for current player */}
        <GameActions
          selectedTokens={selectedTokens}
          onAction={handleGameAction}
          isCurrentPlayerTurn={
            Boolean(currentPlayer && game.players[game.currentPlayerIndex]?.id === currentPlayer && game.state !== GameState.FINISHED)
          }
        />
      </Box>

      {/* Game Over Dialog */}
      {game && showGameOverDialog && (
        <Dialog
          open={showGameOverDialog}
          onClose={handleCloseGameOverDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: `linear-gradient(135deg, ${colors.background.parchment} 0%, ${colors.background.card} 100%)`,
              border: `2px solid ${colors.divider}`,
              borderRadius: `${borderRadius.xl}px`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              color: colors.text.primary,
              textAlign: 'center',
              fontSize: '2rem',
              pb: 2
            }}
          >
            {getGameOverMessage()}
          </DialogTitle>

          <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, pb: 4 }}>
            {/* Winner's Info */}
            {game.winner && (
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  background: isPlayerWinner(currentPlayer || '') 
                    ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                    : 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)',
                  borderRadius: `${borderRadius.lg}px`,
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Cinzel", serif',
                    fontWeight: 700,
                    color: '#000',
                    mb: 1
                  }}
                >
                  {game.winner.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#000',
                    fontWeight: 600
                  }}
                >
                  {game.winner.prestige} Prestige Points
                </Typography>
              </Paper>
            )}

            {/* Final Standings */}
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 600,
                  color: colors.text.primary,
                  textAlign: 'center',
                  mb: 2
                }}
              >
                Final Standings
              </Typography>
              
              {game.players
                .sort((a, b) => b.prestige - a.prestige)
                .map((player, index) => (
                  <Box
                    key={player.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      mb: 1,
                      backgroundColor: player.id === currentPlayer 
                        ? 'rgba(255, 215, 0, 0.1)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      borderRadius: `${borderRadius.md}px`,
                      border: `1px solid ${colors.divider}`
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: colors.text.primary,
                          minWidth: '24px'
                        }}
                      >
                        #{index + 1}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          color: player.id === currentPlayer ? colors.secondary.light : colors.text.primary
                        }}
                      >
                        {player.id === currentPlayer ? 'You' : player.name}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: colors.text.primary
                      }}
                    >
                      {player.prestige} pts
                    </Typography>
                  </Box>
                ))}
            </Box>

            <Button
              onClick={handleCloseGameOverDialog}
              variant="contained"
              sx={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 600,
                backgroundColor: colors.primary.main,
                '&:hover': {
                  backgroundColor: colors.primary.dark
                },
                px: 4,
                py: 1.5
              }}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}

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

      {/* Game Terminated Dialog */}
      <Dialog
        open={gameTerminatedDialog}
        onClose={handleGameTerminatedClose}
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
          Game Ended
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            This game has been ended by another player. You will be returned to the main page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleGameTerminatedClose}
            sx={{ 
              color: '#FFD700',
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.1)'
              }
            }}
          >
            Return to Home
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GamePage;
