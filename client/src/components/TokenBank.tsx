import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { TokenBank as TokenBankType, GemType } from '../../../shared/types/game';
import { borderRadius, colors } from '../theme';
import GemChip from './GemChip';

interface TokenBankProps {
  tokens: TokenBankType;
  selectedTokens: Partial<TokenBankType>;
  onTokenSelectionChange: (tokens: Partial<TokenBankType>) => void;
}

const TokenBank: React.FC<TokenBankProps> = ({ tokens, selectedTokens, onTokenSelectionChange }) => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateSelection = (newSelection: Partial<TokenBankType>): string => {
    // Filter out gold from validation since it cannot be selected
    const selectedGems = Object.entries(newSelection).filter(([gem, count]) => 
      count && count > 0 && gem !== 'gold'
    );

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
    // Gold tokens cannot be taken directly - they are only obtained by reserving cards
    if (gem === 'gold') {
      return;
    }

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
      {/* Section Header */}
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
          fontSize: '1.8rem'
        }}
      >
        Token Bank
      </Typography>

      {/* Token Selection Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
        gap: 2,
        mb: 3,
        justifyItems: 'center'
      }}>
        {Object.entries(tokens).map(([gem, count]) => {
          const selected = selectedTokens[gem as keyof TokenBankType] || 0;
          const isGold = gem === 'gold';
          return (
            <Box key={gem} sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <GemChip
                  gem={gem as GemType}
                  count={count}
                  size="lg"
                  interactive={!isGold}
                  disabled={count === 0 || isGold}
                  selected={selected > 0}
                  onClick={() => handleTokenClick(gem as keyof TokenBankType)}
                  aria-label={
                    isGold 
                      ? `${gem} tokens: ${count} available (obtained by reserving cards)`
                      : `${gem} tokens: ${count} available, ${selected} selected`
                  }
                />

                {/* Selection indicator */}
                {selected > 0 && !isGold && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: colors.primary.main,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      border: '2px solid white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      zIndex: 10
                    }}
                  >
                    {selected}
                  </Box>
                )}
              </Box>

              {/* Gem name label */}
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontWeight: 500,
                  color: 'text.secondary',
                  fontSize: '0.85rem',
                  textTransform: 'capitalize'
                }}
              >
                {gem}
              </Typography>
              
              {/* Special note for gold */}
              {isGold && (
                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    fontSize: '0.7rem',
                    color: 'text.disabled',
                    fontStyle: 'italic',
                    textAlign: 'center'
                  }}
                >
                  (Wildcard)
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Error message */}
      {errorMessage && (
        <Alert
          severity="error"
          sx={{
            mt: 2,
            borderRadius: `${borderRadius.lg}px`,
            border: 'none',
            '& .MuiAlert-message': {
              fontSize: '0.9rem'
            }
          }}
        >
          {errorMessage}
        </Alert>
      )}

      {/* Selection summary */}
      {Object.keys(selectedTokens).length > 0 && !errorMessage && (
        <Box sx={{
          mt: 2,
          p: 2,
          bgcolor: colors.background.parchment,
          borderRadius: `${borderRadius.lg}px`,
          border: `1px solid ${colors.secondary.light}`,
          boxShadow: '0 2px 4px rgba(44, 24, 16, 0.1)'
        }}>
          <Typography
            variant="body1"
            sx={{
              color: colors.text.primary,
              fontWeight: 500,
              textAlign: 'center'
            }}
          >
            Selected: {Object.entries(selectedTokens)
              .filter(([_, count]) => count && count > 0)
              .map(([gem, count]) => `${count} ${gem}`)
              .join(', ')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TokenBank;
