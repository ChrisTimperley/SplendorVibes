// CostPip.tsx – beveled white circle with colored ring and centered number
import { Box } from "@mui/material";
import { GemType } from '../../../shared/types/game';

const RING: Record<GemType, string> = {
  [GemType.DIAMOND]: "#cfd8e3",
  [GemType.SAPPHIRE]: "#2563eb",
  [GemType.EMERALD]: "#059669",
  [GemType.RUBY]: "#dc2626",
  [GemType.ONYX]: "#111827",
  [GemType.GOLD]: "#d4a72c"
};

export default function CostPip({gem, n}:{gem:GemType; n:number}) {
  return (
    <Box sx={{
      width:30, height:30, borderRadius:"999px", position:"relative",
      boxShadow:"inset 0 2px 6px rgba(0,0,0,.06), 0 4px 8px rgba(0,0,0,.15)",
      background:"linear-gradient(#fff,#f3f5f9)", border:"2px solid #fff"
    }}>
      <Box sx={{
        position:"absolute", inset:2, borderRadius:"999px",
        border:`2px solid ${RING[gem]}`
      }}/>
      <Box sx={{
        position:"absolute", inset:0, display:"grid", placeItems:"center",
        fontWeight:800, fontSize:14, color:"#293041", textShadow:"0 1px 0 #fff"
      }}>{n}</Box>
    </Box>
  );
}
