import React from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';
import { GameBoard as GameBoardType, Card } from '../../../shared/types/game';
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
  const handleCardPurchase = (card: Card) => {
    onCardAction('purchase-card', { cardId: card.id });
  };

  const handleCardReserve = (card: Card) => {
    onCardAction('reserve-card', { cardId: card.id });
  };

  return (
    <Box>
      {/* Nobles */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Nobles
        </Typography>
        <Grid container spacing={1}>
          {board.nobles.map((noble) => (
            <Grid item key={noble.id}>
              <NobleComponent noble={noble} />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Cards */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Development Cards
        </Typography>

        {[3, 2, 1].map((tier) => (
          <Box key={tier} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Tier {tier}
            </Typography>
            <Grid container spacing={2}>
              {board.availableCards[`tier${tier}` as keyof typeof board.availableCards].map((card) => (
                <Grid item key={card.id}>
                  <CardComponent
                    card={card}
                    onPurchase={() => handleCardPurchase(card)}
                    onReserve={() => handleCardReserve(card)}
                  />
                </Grid>
              ))}
              {/* Deck indicator */}
              <Grid item>
                <Paper
                  elevation={1}
                  sx={{
                    width: 140,
                    height: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.300',
                    border: '3px solid #ccc',
                    borderStyle: 'dashed'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {board.cardDecks[`tier${tier}` as keyof typeof board.cardDecks].length}
                  </Typography>
                  <Typography variant="caption" align="center">
                    cards left
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Paper>

      {/* Token Bank */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
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
