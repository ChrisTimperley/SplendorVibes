import React from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';
import { GameBoard as GameBoardType } from '../../../shared/types/game';
import { borderRadius, colors } from '../theme';
import CardComponent from './CardComponent';
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
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Nobles */}
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h2" gutterBottom sx={{ mb: 2 }}>
          Nobles
        </Typography>
        <Grid container spacing={2}>
          {board.nobles.map((noble) => (
            <Grid item key={noble.id}>
              <NobleComponent noble={noble} />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Cards */}
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h2" gutterBottom sx={{ mb: 3 }}>
          Development Cards
        </Typography>

        {[3, 2, 1].map((tier) => (
          <Box key={tier} sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 2,
                color: 'primary.main'
              }}
            >
              Tier {tier}
            </Typography>
            <Grid container spacing={2}>
              {board.availableCards[`tier${tier}` as keyof typeof board.availableCards].map((card) => (
                <Grid item key={card.id}>
                  <CardComponent
                    card={card}
                    onAction={onCardAction}
                  />
                </Grid>
              ))}
              {/* Deck indicator */}
              <Grid item>
                <Paper
                  elevation={0}
                  sx={{
                    width: 140,
                    height: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: colors.background.card,
                    border: `2px dashed ${colors.divider}`,
                    borderRadius: `${borderRadius.xl}px`
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      color: 'text.secondary'
                    }}
                  >
                    {board.cardDecks[`tier${tier}` as keyof typeof board.cardDecks].length}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 500
                    }}
                  >
                    cards left
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Paper>

      {/* Token Bank */}
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h2" gutterBottom sx={{ mb: 2 }}>
          Token Bank
        </Typography>
        <TokenBank
          tokens={board.tokens}
          selectedTokens={selectedTokens}
          onTokenSelectionChange={onTokenSelectionChange}
        />
      </Paper>
    </Box>
  );
};

export default GameBoard;
