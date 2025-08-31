// DevCard.tsx (shell; pass props for art, value, costs, bonusGem)
import { Box, Paper, Typography } from "@mui/material";
import JewelBadge from "./JewelBadge";
import CostPip from "./CostPip";
import { GemType } from "../../../shared/types/game";

export default function DevCard({
  value,                     // prestige number (1/2/3/5)
  artUrl,                    // card artwork
  costs,                     // [{gem:'ruby', n:2}, ...]
  bonusGem                   // 'ruby'|'emerald'|'sapphire'|'onyx'|'diamond'
}: {
  value:number;
  artUrl:string;
  costs:{gem:GemType; n:number}[];
  bonusGem:GemType;
}) {
  return (
    <Paper elevation={6} sx={{
      position:"relative",
      width: 220, height: 300, borderRadius: 2,
      overflow:"hidden",
      background: "#fff",
      border: "2px solid #cbd5e1",
      boxShadow: "0 10px 25px rgba(0,0,0,.15), 0 4px 10px rgba(0,0,0,.1)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      "&:hover": {
        transform: "translateY(-6px) scale(1.02)",
        boxShadow: "0 20px 40px rgba(0,0,0,.2), 0 8px 16px rgba(0,0,0,.15)",
        borderColor: "#94a3b8"
      },
      "&:before": { // laminated inner border
        content:'""', position:"absolute", inset:3, borderRadius: 1,
        boxShadow:"inset 0 0 0 1px rgba(255,255,255,.8), inset 0 1px 0 rgba(255,255,255,.9)"
      }
    }}>
      {/* artwork area - full card */}
      <Box sx={{
        position:"absolute", left:0, top:0, right:0, bottom:0,
        backgroundImage:`url(${artUrl})`,
        backgroundSize:"cover",
        backgroundPosition:"center",
        filter:"saturate(1.1) contrast(1.1)"
      }} />

      {/* translucent frosted header overlay */}
      <Box sx={{
        position:"absolute", left:0, top:0, right:0, height:"25%",
        background: "rgba(248, 250, 252, 0.35)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(203, 213, 225, 0.3)"
      }}>
        {/* numeral */}
        <Typography sx={{
          position:"absolute", top:12, left:12, zIndex:2,
          fontFamily:"Cinzel, serif", fontWeight:900, fontSize:36,
          color:"#2d3748",
          textShadow:"0 1px 2px rgba(255,255,255,.8)"
        }}>{value}</Typography>

        {/* bonus jewel */}
        <Box sx={{
          position:"absolute", top:8, right:10, zIndex:2,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,.15))"
        }}>
          <JewelBadge gem={bonusGem} />
        </Box>
      </Box>

      {/* cost column */}
      <Box sx={{
        position:"absolute",
        left:12,
        bottom:16,
        display:"flex",
        flexDirection: "column",
        gap: 1,
        alignItems: "center",
        background: "rgba(255,255,255,.9)",
        borderRadius: 2,
        padding: "6px 4px",
        border: "1px solid rgba(255,255,255,.8)",
        backdropFilter: "blur(4px)"
      }}>
        {costs.map(c => <CostPip key={c.gem} gem={c.gem} n={c.n} />)}
      </Box>
    </Paper>
  );
}
