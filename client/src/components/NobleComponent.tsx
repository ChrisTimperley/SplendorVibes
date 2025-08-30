import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { Noble, GemType } from '../../../shared/types/game';
import { borderRadius, colors } from '../theme';
import { gemColors } from '../constants/gemColors';

interface NobleComponentProps {
  noble: Noble;
}

const NobleComponent: React.FC<NobleComponentProps> = ({ noble }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: 180,
        height: 140,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
        border: `2px solid ${colors.secondary.dark}`,
        borderRadius: `${borderRadius.xl}px`,
        position: 'relative',
        boxShadow: '0 6px 20px rgba(218, 165, 32, 0.25), 0 3px 8px rgba(218, 165, 32, 0.15)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 28px rgba(218, 165, 32, 0.3), 0 4px 12px rgba(218, 165, 32, 0.2)',
          transition: 'all 0.3s ease'
        }
      }}
    >
      {/* Prestige Points */}
      <Box
        sx={{
          position: 'absolute',
          top: -1,
          right: -1,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          border: `2px solid ${colors.primary.dark}`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          boxShadow: '0 3px 8px rgba(139, 69, 19, 0.4)',
          zIndex: 10
        }}
      >
        {noble.prestige}
      </Box>

      {/* Noble Name */}
      <Typography
        variant="h5"
        sx={{
          fontSize: '0.95rem',
          fontWeight: 600,
          color: 'black',
          textAlign: 'center',
          mb: 1.5,
          lineHeight: 1.3,
          fontFamily: '"Cinzel", serif'
        }}
      >
        {noble.name}
      </Typography>

      {/* Requirements */}
      <Typography
        variant="body2"
        sx={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: colors.primary.dark,
          textAlign: 'center',
          mb: 1,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          fontFamily: '"Inter", sans-serif'
        }}
      >
        Requirements
      </Typography>

      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {Object.entries(noble.requirements).map(([gem, count]) => (
          <Box
            key={gem}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: gemColors[gem as GemType] || colors.divider,
              color: gem === 'diamond' ? '#333' :
                     gem === 'gold' ? '#000' :
                     gem === 'onyx' ? '#fff' : 'white',
              borderRadius: `${borderRadius.sm}px`,
              px: 1,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 'bold',
              minHeight: 20,
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              background: `linear-gradient(90deg, ${gemColors[gem as GemType] || colors.divider} 0%, ${gemColors[gem as GemType] || colors.divider}dd 100%)`
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.7)'
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
