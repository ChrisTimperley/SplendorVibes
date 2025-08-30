import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';

interface GameActionsProps {
  selectedTokens: any;
  onAction: (actionType: string, payload: any) => void;
  isCurrentPlayerTurn: boolean;
}

const GameActions: React.FC<GameActionsProps> = ({ selectedTokens, onAction, isCurrentPlayerTurn }) => {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: string;
    payload: any;
  }>({ open: false, action: '', payload: {} });

  // Check if token selection is valid for taking
  const canTakeTokens = () => {
    if (!isCurrentPlayerTurn) return false;
    const selectedGems = Object.entries(selectedTokens || {}).filter(([, count]) => count && (count as number) > 0);
    return selectedGems.length > 0;
  };

  const handleAction = (actionType: string, payload: any) => {
    setConfirmDialog({
      open: true,
      action: actionType,
      payload
    });
  };

  const handleConfirm = () => {
    onAction(confirmDialog.action, confirmDialog.payload);
    setConfirmDialog({ open: false, action: '', payload: {} });
  };

  const handleCancel = () => {
    setConfirmDialog({ open: false, action: '', payload: {} });
  };

  const getConfirmationMessage = () => {
    switch (confirmDialog.action) {
      case 'take-tokens':
        const selectedGems = Object.entries(selectedTokens || {})
          .filter(([, count]) => count && (count as number) > 0)
          .map(([gem, count]) => `${count} ${gem}`)
          .join(', ');
        return `Are you sure you want to take ${selectedGems}?`;
      default:
        return 'Are you sure you want to perform this action?';
    }
  };

  return (
    <Box>
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
          onClick={() => handleAction('take-tokens', { tokens: selectedTokens })}
          disabled={!canTakeTokens()}
          sx={{
            bgcolor: isCurrentPlayerTurn ? '#1976d2' : '#9e9e9e',
            '&:hover': { bgcolor: isCurrentPlayerTurn ? '#1565c0' : '#9e9e9e' },
            '&:disabled': { bgcolor: '#e0e0e0', color: '#9e9e9e' }
          }}
        >
          {!isCurrentPlayerTurn ? 'WAIT FOR YOUR TURN' : 'TAKE TOKENS'}
        </Button>
      </Box>

      <Dialog open={confirmDialog.open} onClose={handleCancel}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>{getConfirmationMessage()}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>CANCEL</Button>
          <Button onClick={handleConfirm} variant="contained">CONFIRM</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GameActions;
