import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, Chip } from '@mui/material';
import { TokenBank as TokenBankType, GemType } from '../../../shared/types/game';
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
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {Object.entries(tokens).map(([gem, count]) => {
          const selected = selectedTokens[gem as keyof TokenBankType] || 0;
          return (
            <Box key={gem} sx={{ textAlign: 'center' }}>
              <Button
                onClick={() => handleTokenClick(gem as keyof TokenBankType)}
                disabled={count === 0}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: gemColors[gem as GemType],
                  color: gem === 'diamond' || gem === 'gold' ? 'black' : 'white',
                  border: gem === 'diamond' ? '2px solid #ccc' : 'none',
                  position: 'relative',
                  '&:hover': {
                    bgcolor: gemColors[gem as GemType],
                    opacity: 0.8
                  }
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  {count}
                </Typography>
                {selected > 0 && (
                  <Chip
                    size="small"
                    label={selected}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      bgcolor: 'red',
                      color: 'white',
                      width: 20,
                      height: 20
                    }}
                  />
                )}
              </Button>
              <Typography variant="caption" display="block">
                {gem.charAt(0).toUpperCase() + gem.slice(1)}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Error message */}
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Selection summary */}
      {Object.keys(selectedTokens).length > 0 && !errorMessage && (
        <Box sx={{ mt: 1, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
          <Typography variant="body2" color="success.dark">
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
