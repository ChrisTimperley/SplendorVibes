import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { Noble, GemType } from '../../../shared/types/game';
import { gemColors } from '../constants/gemColors';

interface NobleComponentProps {
  noble: Noble;
}

// Square cost pip component for nobles
const SquareCostPip: React.FC<{ gem: GemType; count: number }> = ({ gem, count }) => {
  const gemColor = gemColors[gem];

  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        backgroundColor: gemColor,
        border: '1px solid rgba(0,0,0,0.2)',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        color: gem === 'diamond' ? '#333' :
               gem === 'gold' ? '#000' :
               gem === 'onyx' ? '#fff' : 'white',
        textShadow: gem === 'diamond' || gem === 'gold' ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)'
      }}
    >
      {count}
    </Box>
  );
};

const NobleComponent: React.FC<NobleComponentProps> = ({ noble }) => {
  // Map noble IDs to their corresponding artwork files
  // To add new artwork: place noble_X.png files in public/noble-art/ and add mapping below
  const getNobleArtUrl = (nobleId: string): string | null => {
    const artMapping: Record<string, string> = {
      'noble_1': '/noble-art/noble_1.png', // Catherine de' Medici
      // Add more mappings as artwork becomes available:
      // 'noble_2': '/noble-art/noble_2.png', // Elisabeth of Austria
      // 'noble_3': '/noble-art/noble_3.png', // Isabella I of Castile
      // 'noble_4': '/noble-art/noble_4.png', // Niccolò Machiavelli
      // 'noble_5': '/noble-art/noble_5.png', // Suleiman the Magnificent
      // 'noble_6': '/noble-art/noble_6.png', // Anne of Brittany
      // 'noble_7': '/noble-art/noble_7.png', // Charles V
      // 'noble_8': '/noble-art/noble_8.png', // Francis I of France
      // 'noble_9': '/noble-art/noble_9.png', // Henry VIII
      // 'noble_10': '/noble-art/noble_10.png', // Mary Stuart
    };
    return artMapping[nobleId] || null;
  };

  const portraitUrl = getNobleArtUrl(noble.id);

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'relative',
        width: 220, // Match development card width
        height: 180, // Shorter than dev cards
        borderRadius: 2,
        overflow: 'hidden',
        background: '#fff',
        border: '2px solid #cbd5e1',
        boxShadow: '0 10px 25px rgba(0,0,0,.15), 0 4px 10px rgba(0,0,0,.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(0,0,0,.2), 0 8px 16px rgba(0,0,0,.15)',
          borderColor: '#94a3b8'
        },
        '&:before': { // laminated inner border
          content: '""',
          position: 'absolute',
          inset: 3,
          borderRadius: 1,
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.8), inset 0 1px 0 rgba(255,255,255,.9)'
        }
      }}
    >
      {/* Portrait artwork area - full card background */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, #8b4513 0%, #654321 100%)`, // Fallback
          ...(portraitUrl && {
            backgroundImage: `url(${portraitUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(1.1) contrast(1.1)',
          }),
          // Fallback placeholder pattern
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: !portraitUrl ? `linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(101, 67, 33, 0.3) 100%)` : 'none',
            backgroundImage: !portraitUrl ? `radial-gradient(circle at center, rgba(245, 245, 220, 0.2) 0%, transparent 70%)` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
      />

      {/* Placeholder portrait icon when image fails to load or no artwork available */}
      {!portraitUrl && (
        <Box
          sx={{
            position: 'absolute',
            right: '15%', // Better positioning in the portrait area
            top: '50%',
            transform: 'translateY(-50%)',
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'rgba(139, 69, 19, 0.8)',
            border: '3px solid rgba(245, 245, 220, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f5f5dc',
            fontSize: '1.8rem',
            fontFamily: '"Cinzel", serif',
            fontWeight: 'bold',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            zIndex: 1,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}
        >
          {noble.name.charAt(0)}
        </Box>
      )}

      {/* Vertical frosted panel on the left */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '25%',
          background: 'rgba(248, 250, 252, 0.35)',
          backdropFilter: 'blur(8px)',
          borderRight: '1px solid rgba(203, 213, 225, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          py: 2,
          px: 1,
          zIndex: 2
        }}
      >
        {/* Prestige points at top */}
        <Typography
          sx={{
            fontFamily: 'Cinzel, serif',
            fontWeight: 900,
            fontSize: 42, // Larger to match dev cards better
            color: '#ffffffff',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
            lineHeight: 1,
            mb: 2
          }}
        >
          {noble.prestige}
        </Typography>

        {/* Square cost pips in vertical column */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75, // Slightly more spacing
            alignItems: 'center',
            width: '100%'
          }}
        >
          {Object.entries(noble.requirements).map(([gem, count]) => (
            <SquareCostPip
              key={gem}
              gem={gem as GemType}
              count={count}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default NobleComponent;
