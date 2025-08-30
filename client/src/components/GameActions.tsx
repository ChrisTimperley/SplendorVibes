import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { borderRadius } from '../theme';

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
          bottom: 3,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 2,
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: `${borderRadius.xl}px`,
          boxShadow: '0 8px 32px rgba(44, 24, 16, 0.15), 0 4px 16px rgba(44, 24, 16, 0.1)',
          border: '1px solid rgba(232, 213, 183, 0.3)'
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleAction('take-tokens', { tokens: selectedTokens })}
          disabled={!canTakeTokens()}
          sx={{
            minWidth: 180,
            height: 48,
            fontSize: '0.95rem',
            fontWeight: 600,
            ...(isCurrentPlayerTurn ? {} : {
              bgcolor: 'rgba(158, 158, 158, 0.3)',
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'rgba(158, 158, 158, 0.3)'
              }
            })
          }}
        >
          {!isCurrentPlayerTurn ? 'WAIT FOR YOUR TURN' : 'TAKE TOKENS'}
        </Button>
      </Box>

      <Dialog
        open={confirmDialog.open}
        onClose={handleCancel}
        PaperProps={{
          sx: {
            borderRadius: `${borderRadius.xl}px`,
            p: 1.5
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: '"Cinzel", serif', fontSize: '1.25rem' }}>
          Confirm Action
        </DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.5 }}>
            {getConfirmationMessage()}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ gap: 1.5, p: 2 }}>
          <Button
            onClick={handleCancel}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            CANCEL
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{ minWidth: 100 }}
          >
            CONFIRM
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GameActions;
