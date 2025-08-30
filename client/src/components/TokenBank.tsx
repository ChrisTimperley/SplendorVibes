import React, { useState } from 'react';
import { Box, Button, Typography, Chip } from '@mui/material';
import { TokenBank as TokenBankType, GemType } from '../../../shared/types/game';

interface TokenBankProps {
  tokens: TokenBankType;
  onTakeTokens: (tokens: Partial<TokenBankType>) => void;
}

const gemColors = {
  [GemType.DIAMOND]: '#ffffff',
  [GemType.SAPPHIRE]: '#0066cc',
  [GemType.EMERALD]: '#00cc66',
  [GemType.RUBY]: '#cc0000',
  [GemType.ONYX]: '#333333',
  [GemType.GOLD]: '#ffcc00'
};

const TokenBank: React.FC<TokenBankProps> = ({ tokens, onTakeTokens }) => {
  const [selectedTokens, setSelectedTokens] = useState<Partial<TokenBankType>>({});

  const handleTokenClick = (gem: keyof TokenBankType) => {
    const current = selectedTokens[gem] || 0;
    const available = tokens[gem];

    if (current === 0 && available > 0) {
      setSelectedTokens(prev => ({ ...prev, [gem]: 1 }));
    } else if (current === 1 && available >= 4) {
      setSelectedTokens(prev => ({ ...prev, [gem]: 2 }));
    } else {
      setSelectedTokens(prev => {
        const newTokens = { ...prev };
        delete newTokens[gem];
        return newTokens;
      });
    }
  };

  const handleTakeTokens = () => {
    onTakeTokens(selectedTokens);
    setSelectedTokens({});
  };

  const selectedCount = Object.values(selectedTokens).reduce((sum, count) => sum + (count || 0), 0);
  const selectedGemTypes = Object.keys(selectedTokens).length;

  const isValidSelection = () => {
    if (selectedCount === 0) return false;
    if (selectedGemTypes === 3 && selectedCount === 3) return true;
    if (selectedGemTypes === 1 && selectedCount === 2) return true;
    return false;
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

      {selectedCount > 0 && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Selected: {Object.entries(selectedTokens).map(([gem, count]) =>
              `${count} ${gem}`
            ).join(', ')}
          </Typography>
          <Button
            variant="contained"
            onClick={handleTakeTokens}
            disabled={!isValidSelection()}
            color={isValidSelection() ? 'primary' : 'error'}
          >
            Take Tokens
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TokenBank;
