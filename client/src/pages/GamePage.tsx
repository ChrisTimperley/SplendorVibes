import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Game } from '../../../shared/types/game';
import { gameService } from '../services/gameService';
import { socketService } from '../services/socketService';
import GameBoard from '../components/GameBoard';
import PlayerArea from '../components/PlayerArea';
import GameActions from '../components/GameActions';

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<any>({});
  const [loading, setLoading] = useState(true);

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

  const handleGameAction = async (action: string, payload: any) => {
    if (!game || !gameId || !currentPlayer) return;

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
        gridTemplateColumns: '1fr 320px',
        gap: 3,
        p: 2,
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
          onCardAction={handleGameAction}
          selectedTokens={selectedTokens}
          onTokenSelectionChange={setSelectedTokens}
        />
      </Box>

      {/* Sticky Player Sidebar */}
      <Box
        sx={{
          position: 'sticky',
          top: 16,
          height: 'fit-content',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          p: 2,
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
            mb: 2,
            fontSize: '1.1rem',
            textAlign: 'center',
          }}
        >
          Players
        </Typography>

        {/* All Players */}
        {game.players.map((player, index) => (
          <Box key={player.id} sx={{ mb: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: player.id === currentPlayer ? 'gold' : 'white',
                mb: 1,
                fontSize: '0.95rem'
              }}
            >
              {player.id === currentPlayer ? 'You: ' : ''}{player.name}
              {game.currentPlayerIndex === index ? ' (Current Turn)' : ''}
            </Typography>

            <PlayerArea
              player={player}
              isCurrentPlayer={game.currentPlayerIndex === index}
            />
          </Box>
        ))}

        {/* Game Actions for current player */}
        <GameActions
          selectedTokens={selectedTokens}
          onAction={handleGameAction}
          isCurrentPlayerTurn={
            Boolean(currentPlayer && game.players[game.currentPlayerIndex]?.id === currentPlayer)
          }
        />
      </Box>
    </Box>
  );
};

export default GamePage;
