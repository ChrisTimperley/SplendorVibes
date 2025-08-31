import React from 'react';
import { Typography, Box } from '@mui/material';
import { GameBoard as GameBoardType } from '../../../shared/types/game';
import { borderRadius, colors } from '../theme';
import GameCard from './GameCard';
import NobleComponent from './NobleComponent';
import TokenBank from './TokenBank';

interface GameBoardProps {
  board: GameBoardType;
  onCardAction: (action: string, payload: any) => void;
  selectedTokens: any;
  onTokenSelectionChange: (tokens: any) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCardAction,
  selectedTokens,
  onTokenSelectionChange
}) => {
  // Use DevCard dimensions (220x300)
  const cardSize = { width: 220, height: 300 };

  const DeckPlaceholder: React.FC<{ count: number }> = ({ count }) => (
    <Box
      sx={{
        width: cardSize.width,
        height: cardSize.height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${colors.background.parchment} 0%, ${colors.background.card} 100%)`,
        border: `2px solid ${colors.divider}`,
        borderRadius: `${borderRadius.xl}px`,
        position: 'relative',
        boxShadow: `
          0 4px 8px rgba(44, 24, 16, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.3)
        `,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '20%',
          left: '15%',
          right: '15%',
          bottom: '20%',
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 8px,
            ${colors.divider} 8px,
            ${colors.divider} 10px
          )`,
          opacity: 0.3,
          borderRadius: `${borderRadius.md}px`
        }
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 'bold',
          mb: 1,
          color: colors.text.secondary,
          fontSize: '2rem',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          zIndex: 2
        }}
      >
        {count}
      </Typography>
      <Typography
        variant="body1"
        align="center"
        sx={{
          color: colors.text.secondary,
          fontWeight: 600,
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          zIndex: 2
        }}
      >
        Cards<br />Remaining
      </Typography>

      {/* Decorative corner elements */}
      {[0, 1, 2, 3].map(corner => (
        <Box
          key={corner}
          sx={{
            position: 'absolute',
            width: 12,
            height: 12,
            ...(corner === 0 && { top: 8, left: 8 }),
            ...(corner === 1 && { top: 8, right: 8 }),
            ...(corner === 2 && { bottom: 8, left: 8 }),
            ...(corner === 3 && { bottom: 8, right: 8 }),
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '100%',
              height: '2px',
              bgcolor: colors.secondary.main,
              ...(corner < 2 ? { top: 0 } : { bottom: 0 })
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '2px',
              height: '100%',
              bgcolor: colors.secondary.main,
              ...(corner % 2 === 0 ? { left: 0 } : { right: 0 })
            }
          }}
        />
      ))}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Nobles Section */}
      <Box>
        <Typography
          variant="h2"
          sx={{
            mb: 3,
            fontFamily: '"Cinzel", serif',
            fontWeight: 600,
            color: colors.text.primary,
            textAlign: 'center'
          }}
        >
          Nobles
        </Typography>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 2,
          justifyItems: 'center',
          px: 2
        }}>
          {board.nobles.map((noble) => (
            <NobleComponent key={noble.id} noble={noble} />
          ))}
        </Box>
      </Box>

      {/* Development Cards Section */}
      <Box>
        <Typography
          variant="h2"
          sx={{
            mb: 4,
            fontFamily: '"Cinzel", serif',
            fontWeight: 600,
            color: colors.text.primary,
            textAlign: 'center'
          }}
        >
          Development Cards
        </Typography>

        {[3, 2, 1].map((tier) => (
          <Box key={tier} sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 600,
                mb: 3,
                color: colors.primary.main,
                textAlign: 'center',
                fontSize: '1.5rem'
              }}
            >
              Tier {tier}
            </Typography>

            <Box sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(${cardSize.width}px, 1fr))`,
              gap: 2,
              justifyItems: 'center',
              px: 2
            }}>
              {board.availableCards[`tier${tier}` as keyof typeof board.availableCards].map((card) => (
                <GameCard
                  key={card.id}
                  card={card}
                  onPurchase={() => onCardAction('purchase-card', { cardId: card.id })}
                />
              ))}

              {/* Parchment-style deck placeholder */}
              <DeckPlaceholder
                count={board.cardDecks[`tier${tier}` as keyof typeof board.cardDecks].length}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Token Bank Section */}
      <Box>
        <TokenBank
          tokens={board.tokens}
          selectedTokens={selectedTokens}
          onTokenSelectionChange={onTokenSelectionChange}
        />
      </Box>
    </Box>
  );
};

export default GameBoard;
