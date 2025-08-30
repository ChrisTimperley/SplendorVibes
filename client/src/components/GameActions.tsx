import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Game } from '../../../shared/types/game';

interface GameActionsProps {
  game: Game;
  playerId: string;
  onAction: (action: string, payload: any) => void;
}

const GameActions: React.FC<GameActionsProps> = ({ game, playerId, onAction }) => {
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');

  const handleAction = (actionType: string) => {
    setSelectedAction(actionType);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    // This is a simplified version - in a real implementation,
    // you'd have specific dialogs for each action type with proper forms
    switch (selectedAction) {
      case 'take-tokens':
        onAction('take-tokens', { playerId, tokens: { diamond: 1, sapphire: 1, emerald: 1 } });
        break;
      case 'purchase-card':
        // Would show a card selection dialog
        break;
      case 'reserve-card':
        // Would show a card selection dialog
        break;
    }
    setActionDialogOpen(false);
  };

  const isPlayerTurn = game.players[game.currentPlayerIndex]?.id === playerId;

  if (!isPlayerTurn) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 2,
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleAction('take-tokens')}
        >
          Take Tokens
        </Button>
        <Button
          variant="contained"
          onClick={() => handleAction('purchase-card')}
        >
          Purchase Card
        </Button>
        <Button
          variant="contained"
          onClick={() => handleAction('reserve-card')}
        >
          Reserve Card
        </Button>
      </Box>

      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          Are you sure you want to {selectedAction.replace('-', ' ')}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmAction} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GameActions;
