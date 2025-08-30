import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, Paper } from '@mui/material';
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

        // For demo purposes, use the first player's ID
        const playerId = gameData.players[0]?.id || 'demo-player';
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
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <GameBoard
            board={game.board}
            onCardAction={handleGameAction}
            selectedTokens={selectedTokens}
            onTokenSelectionChange={setSelectedTokens}
          />
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {game.players.map((player, index) => (
              <PlayerArea
                key={player.id}
                player={player}
                isCurrentPlayer={index === game.currentPlayerIndex}
                isActivePlayer={player.id === currentPlayer}
              />
            ))}
          </Box>
        </Grid>
      </Grid>

      {currentPlayer && (
        <GameActions
          selectedTokens={selectedTokens}
          onAction={handleGameAction}
        />
      )}
    </Box>
  );
};

export default GamePage;
