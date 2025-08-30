import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { Noble, GemType } from '../../../shared/types/game';
import { gemColors } from '../constants/gemColors';

interface NobleComponentProps {
  noble: Noble;
}

const NobleComponent: React.FC<NobleComponentProps> = ({ noble }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: 160,
        height: 120,
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        border: '2px solid #FF8C00',
        borderRadius: 2,
        position: 'relative',
        boxShadow: '0 4px 12px rgba(255, 165, 0, 0.3)'
      }}
    >
      {/* Prestige Points */}
      <Box
        sx={{
          position: 'absolute',
          top: -8,
          right: -8,
          width: 28,
          height: 28,
          borderRadius: '50%',
          bgcolor: '#8B4513',
          border: '2px solid #A0522D',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          zIndex: 10
        }}
      >
        {noble.prestige}
      </Box>

      {/* Noble Name */}
      <Typography
        variant="h6"
        sx={{
          fontSize: '0.8rem',
          fontWeight: 'bold',
          color: '#1a1a1a',
          textAlign: 'center',
          mb: 1,
          lineHeight: 1.2
        }}
      >
        {noble.name}
      </Typography>

      {/* Requirements */}
      <Typography
        variant="caption"
        sx={{
          fontSize: '0.65rem',
          fontWeight: 600,
          color: '#333',
          textAlign: 'center',
          mb: 0.5,
          textTransform: 'uppercase',
          letterSpacing: 0.5
        }}
      >
        Requirements
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
        {Object.entries(noble.requirements).map(([gem, count]) => (
          <Box
            key={gem}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.3,
              bgcolor: gemColors[gem as GemType] || '#ccc',
              color: gem === 'diamond' ? '#333' :
                     gem === 'gold' ? '#000' :
                     gem === 'onyx' ? '#fff' : 'white',
              borderRadius: 1,
              px: 0.5,
              py: 0.2,
              fontSize: '0.65rem',
              fontWeight: 'bold',
              minHeight: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              background: `linear-gradient(90deg, ${gemColors[gem as GemType] || '#ccc'} 0%, ${gemColors[gem as GemType] || '#ccc'}dd 100%)`
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.6)'
              }}
            />
            {count}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default NobleComponent;
