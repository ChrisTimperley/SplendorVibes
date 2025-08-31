// DevCard.tsx (shell; pass props for art, value, costs, bonusGem)
import { Box, Paper, Typography } from "@mui/material";
import JewelBadge from "./JewelBadge";
import CostPip from "./CostPip";

export default function DevCard({
  value,                     // prestige number (1/2/3/5)
  artUrl,                    // card artwork
  costs,                     // [{gem:'ruby', n:2}, ...]
  bonusGem                   // 'ruby'|'emerald'|'sapphire'|'onyx'|'diamond'
}: {
  value:number;
  artUrl:string;
  costs:{gem:Gem; n:number}[];
  bonusGem:Gem;
}) {
  return (
    <Paper elevation={3} sx={{
      position:"relative",
      width: 220, height: 300, borderRadius: 3,
      overflow:"hidden",
      background: "linear-gradient(#fff,#f7f9fc)",
      border: "1px solid #e7ebf3",
      boxShadow: "0 6px 18px rgba(0,0,0,.16)",
      "&:before": { // laminated inner border
        content:'""', position:"absolute", inset:4, borderRadius: 2.3,
        boxShadow:"inset 0 0 0 1px rgba(255,255,255,.7)"
      }
    }}>
      {/* numeral */}
      <Typography sx={{
        position:"absolute", top:8, left:10, zIndex:2,
        fontFamily:"Cinzel, serif", fontWeight:1000, fontSize:32,
        color:"#fff", WebkitTextStroke:"1px #505764",
        textShadow:"0 2px 1px rgba(0,0,0,.45)"
      }}>{value}</Typography>

      {/* bonus jewel */}
      <Box sx={{ position:"absolute", top:8, right:10, zIndex:2 }}>
        <JewelBadge gem={bonusGem} />
      </Box>

      {/* art band */}
      <Box sx={{
        position:"absolute", left:0, top:0, right:0, height:"62%",
        backgroundImage:`url(${artUrl})`,
        backgroundSize:"cover", backgroundPosition:"center",
        filter:"saturate(1.05) contrast(1.05)"
      }} />
      {/* divider */}
      <Box sx={{ position:"absolute", top:"62%", left:0, right:0, height:1, background:"linear-gradient(#d9dde6,#f7f9fc)" }}/>

      {/* light paper in lower area */}
      <Box sx={{
        position:"absolute", top:"62%", bottom:0, left:0, right:0,
        background: "radial-gradient(120px 80px at 50% 10%, #f3f6fb, #eef2f7)"
      }}/>

      {/* cost column */}
      <Box sx={{ position:"absolute", left:8, bottom:12, display:"grid", gap:0.75 }}>
        {costs.map(c => <CostPip key={c.gem} gem={c.gem} n={c.n} />)}
      </Box>
    </Paper>
  );
}
type Gem = 'diamond'|'sapphire'|'emerald'|'ruby'|'onyx'|'gold';
