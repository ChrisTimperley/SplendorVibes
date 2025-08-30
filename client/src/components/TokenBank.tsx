import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, Chip } from '@mui/material';
import { TokenBank as TokenBankType, GemType } from '../../../shared/types/game';
import { borderRadius, colors } from '../theme';
import { gemColors } from '../constants/gemColors';

interface TokenBankProps {
  tokens: TokenBankType;
  selectedTokens: Partial<TokenBankType>;
  onTokenSelectionChange: (tokens: Partial<TokenBankType>) => void;
}

const TokenBank: React.FC<TokenBankProps> = ({ tokens, selectedTokens, onTokenSelectionChange }) => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateSelection = (newSelection: Partial<TokenBankType>): string => {
    const selectedGems = Object.entries(newSelection).filter(([, count]) => count && count > 0);

    if (selectedGems.length === 0) return '';

    // Rule 1: Take 3 different gems
    if (selectedGems.length === 3) {
      const allSingleGems = selectedGems.every(([, count]) => count === 1);
      if (!allSingleGems) {
        return 'When taking 3 gems, you can only take 1 of each type.';
      }
      return '';
    }

    // Rule 2: Take 2 of the same gem (if 4+ available)
    if (selectedGems.length === 1) {
      const [gem, count] = selectedGems[0];
      if (count === 2) {
        if (tokens[gem as keyof TokenBankType] < 4) {
          return 'You can only take 2 of the same gem if there are 4 or more available.';
        }
        return '';
      }
      if (count === 1) {
        return '';
      }
      return 'Invalid selection.';
    }

    // Invalid combinations
    if (selectedGems.length === 2) {
      return 'You can take either 3 different gems OR 2 of the same gem (if 4+ available).';
    }

    return 'Invalid token selection.';
  };

  // Validate selection whenever it changes
  useEffect(() => {
    const error = validateSelection(selectedTokens);
    setErrorMessage(error);
  }, [selectedTokens]);

  const handleTokenClick = (gem: keyof TokenBankType) => {
    const current = selectedTokens[gem] || 0;
    const available = tokens[gem];

    let newSelection: Partial<TokenBankType>;

    if (current === 0 && available > 0) {
      newSelection = { ...selectedTokens, [gem]: 1 };
    } else if (current === 1 && available >= 4) {
      newSelection = { ...selectedTokens, [gem]: 2 };
    } else {
      newSelection = { ...selectedTokens };
      delete newSelection[gem];
    }

    onTokenSelectionChange(newSelection);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        {Object.entries(tokens).map(([gem, count]) => {
          const selected = selectedTokens[gem as keyof TokenBankType] || 0;
          return (
            <Box key={gem} sx={{ textAlign: 'center' }}>
              <Button
                onClick={() => handleTokenClick(gem as keyof TokenBankType)}
                disabled={count === 0}
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  bgcolor: gemColors[gem as GemType],
                  color: gem === 'diamond' || gem === 'gold' ? 'black' : 'white',
                  border: gem === 'diamond' ? '2px solid #ccc' : 'none',
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(44, 24, 16, 0.15), 0 2px 4px rgba(44, 24, 16, 0.08)',
                  '&:hover': {
                    bgcolor: gemColors[gem as GemType],
                    opacity: 0.8,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(44, 24, 16, 0.2), 0 3px 6px rgba(44, 24, 16, 0.12)'
                  },
                  '&:disabled': {
                    opacity: 0.3
                  }
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  {count}
                </Typography>
                {selected > 0 && (
                  <Chip
                    size="small"
                    label={selected}
                    sx={{
                      position: 'absolute',
                      top: -1,
                      right: -1,
                      bgcolor: colors.primary.main,
                      color: 'white',
                      width: 24,
                      height: 24,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      borderRadius: '50%'
                    }}
                  />
                )}
              </Button>
              <Typography
                variant="body2"
                display="block"
                sx={{
                  mt: 1,
                  fontWeight: 500,
                  color: 'text.secondary',
                  fontSize: '0.85rem'
                }}
              >
                {gem.charAt(0).toUpperCase() + gem.slice(1)}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Error message */}
      {errorMessage && (
        <Alert
          severity="error"
          sx={{
            mt: 1,
            borderRadius: `${borderRadius.lg}px`,
            border: 'none'
          }}
        >
          {errorMessage}
        </Alert>
      )}

      {/* Selection summary */}
      {Object.keys(selectedTokens).length > 0 && !errorMessage && (
        <Box sx={{
          mt: 1,
          p: 2,
          bgcolor: colors.background.card,
          borderRadius: `${borderRadius.lg}px`,
          border: `1px solid ${colors.secondary.light}`
        }}>
          <Typography variant="body1" sx={{ color: colors.secondary.dark, fontWeight: 500 }}>
            Selected: {Object.entries(selectedTokens).map(([gem, count]) =>
              `${count} ${gem}`
            ).join(', ')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TokenBank;
