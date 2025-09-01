import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Alert, Tooltip, Button } from '@mui/material';
import { TokenBank as TokenBankType, GemType } from '../../../shared/types/game';
import { borderRadius, colors } from '../theme';
import GemChip from './GemChip';

interface TokenBankProps {
  tokens: TokenBankType;
  selectedTokens: Partial<TokenBankType>;
  onTokenSelectionChange: (tokens: Partial<TokenBankType>) => void;
}

/** Pure validator for easy testing/reuse. */
export function validateTokenSelection(
  selection: Partial<TokenBankType>,
  bank: TokenBankType
): string {
  const entries = Object.entries(selection)
    .filter(([g, c]) => g !== 'gold' && (c ?? 0) > 0) as [keyof TokenBankType, number][];

  if (entries.length === 0) return '';

  if (entries.length === 3) {
    const allOnes = entries.every(([, c]) => c === 1);
    return allOnes ? '' : 'When taking 3 gems, you can only take 1 of each type.';
  }

  if (entries.length === 1) {
    const [g, c] = entries[0];
    if (c === 2) {
      if (bank[g] < 4) return 'You can only take 2 of a color if at least 4 remain.';
      return '';
    }
    if (c === 1) return '';
    return 'Invalid selection.';
  }

  // 2 colors is never valid
  return 'You can take either 3 different gems OR 2 of the same gem (if 4+ available).';
}

const GEM_ORDER: (keyof TokenBankType)[] = ['diamond', 'sapphire', 'emerald', 'ruby', 'onyx', 'gold'];

const TokenBank: React.FC<TokenBankProps> = ({ tokens, selectedTokens, onTokenSelectionChange }) => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setErrorMessage(validateTokenSelection(selectedTokens, tokens));
  }, [selectedTokens, tokens]);

  const toggleGem = useCallback(
    (gem: keyof TokenBankType) => {
      if (gem === 'gold') return; // cannot take directly

      const current = selectedTokens[gem] || 0;
      const available = tokens[gem];
      let next: Partial<TokenBankType>;

      if (current === 0 && available > 0) {
        next = { ...selectedTokens, [gem]: 1 };
      } else if (current === 1 && available >= 4) {
        next = { ...selectedTokens, [gem]: 2 };
      } else {
        next = { ...selectedTokens };
        delete next[gem];
      }
      onTokenSelectionChange(next);
    },
    [onTokenSelectionChange, selectedTokens, tokens]
  );

  const clearSelection = () => onTokenSelectionChange({});

  return (
    <Box
      sx={{
        background: 'rgba(0, 0, 0, 0.4)', // Added semi-transparent background
        borderRadius: 2,
        border: '1px solid rgba(255, 255, 255, 0.15)',
        p: 2,
        backdropFilter: 'blur(4px)', // Added blur for better visual separation
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1.5 }}> {/* Reduced mb from 2 */}
        <Typography
          component="h2"
          variant="h4"
          sx={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 700,
            color: '#fff',
            textAlign: 'center',
            letterSpacing: '.08em',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)', // Added text shadow for better contrast
            fontSize: '1.4rem', // Reduced from 1.6rem
          }}
        >
          Available Tokens
        </Typography>
        <Button size="small" onClick={clearSelection} sx={{ color: '#eab308', textTransform: 'none', fontWeight: 700 }}>
          Clear
        </Button>
      </Box>

      {/* Token grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
          gap: { xs: 2, md: 2.5 }, // Reduced from 3 and 4
          mb: 2, // Reduced from 3
          alignItems: 'start',
          justifyItems: 'center',
        }}
      >
        {GEM_ORDER.map((gem) => {
          const count = tokens[gem];
          const selected = selectedTokens[gem] || 0;
          const isGold = gem === 'gold';
          const disabled = count === 0 || isGold;

          return (
            <Box key={gem} sx={{ textAlign: 'center', position: 'relative' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                {/* Low-stock pulse (≤2) */}
                {!isGold && count <= 2 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: -6,
                      borderRadius: '999px',
                      boxShadow: '0 0 0 0 rgba(234,179,8,.35)',
                      animation: 'sv-pulse 1.2s ease-in-out infinite',
                      pointerEvents: 'none',
                      '@keyframes sv-pulse': {
                        '0%': { boxShadow: '0 0 0 0 rgba(234,179,8,.35)' },
                        '100%': { boxShadow: '0 0 0 12px rgba(234,179,8,0)' },
                      },
                    }}
                  />
                )}

                <Tooltip
                  title={
                    isGold
                      ? `Gold: ${count} available — obtained by reserving a card`
                      : `${gem[0].toUpperCase() + gem.slice(1)}: ${count} available${
                          selected ? ` • selected ${selected}` : ''
                        }`
                  }
                  placement="top"
                >
                  <Box
                    onClick={() => !disabled && toggleGem(gem)}
                    sx={{ cursor: disabled ? 'default' : 'pointer' }}
                  >
                    <GemChip
                      gem={gem as GemType}
                      count={count}
                      size="lg"
                      interactive={!isGold}
                      disabled={disabled}
                      selected={selected > 0}
                      aria-label={
                        isGold
                          ? `${gem} tokens: ${count} available (obtained by reserving cards)`
                          : `${gem} tokens: ${count} available, ${selected} selected`
                      }
                    />
                  </Box>
                </Tooltip>

                {/* Selection badge */}
                {selected > 0 && !isGold && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      bgcolor: colors.primary.main,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      border: '2px solid white',
                      boxShadow: '0 2px 4px rgba(0,0,0,.25)',
                      zIndex: 10,
                    }}
                  >
                    {selected}
                  </Box>
                )}
              </Box>

              {/* Label */}
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,.75)',
                  fontSize: '0.8rem',
                  letterSpacing: '.06em',
                  textTransform: 'capitalize',
                }}
              >
                {gem}
              </Typography>

              {isGold && (
                <Typography
                  variant="caption"
                  sx={{ mt: 0.5, fontSize: '0.7rem', color: 'rgba(255,255,255,.55)', fontStyle: 'italic' }}
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
            '& .MuiAlert-message': { fontSize: '0.9rem' },
          }}
        >
          {errorMessage}
        </Alert>
      )}

      {/* Selection summary as chips */}
      {Object.keys(selectedTokens).length > 0 && !errorMessage && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: colors.background.parchment,
            borderRadius: `${borderRadius.lg}px`,
            border: `1px solid ${colors.secondary.light}`,
            boxShadow: '0 2px 4px rgba(44, 24, 16, .08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.25,
            flexWrap: 'wrap',
          }}
        >
          {GEM_ORDER.filter((g) => (selectedTokens[g] ?? 0) > 0).map((g) => (
            <GemChip key={g} gem={g as GemType} count={selectedTokens[g]!} size="md" interactive={false} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TokenBank;
