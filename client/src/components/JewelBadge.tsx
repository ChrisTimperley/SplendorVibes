import { GemType } from '../../../shared/types/game';

// JewelBadge.tsx – square jewel with facets; color driven by `gem`
const COLORS: Record<GemType, string> = {
  [GemType.DIAMOND]: "#e9eef5",
  [GemType.SAPPHIRE]: "#2563eb",
  [GemType.EMERALD]: "#059669",
  [GemType.RUBY]: "#dc2626",
  [GemType.ONYX]: "#111827",
  [GemType.GOLD]: "#d4a72c"
};

interface JewelBadgeProps {
  gem: GemType;
}

export default function JewelBadge({ gem }: JewelBadgeProps) {
  const c = COLORS[gem];
  const gradientId = `gradient-${gem}`; // Unique ID for each gem type

  return (
    <svg width="34" height="34" viewBox="0 0 34 34" role="img" aria-label={`${gem} bonus`}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".45"/>
          <stop offset=".35" stopColor={c}/>
          <stop offset="1" stopColor="#000" stopOpacity=".15"/>
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="32" height="32" rx="6" fill={`url(#${gradientId})`} stroke="#ffffff" strokeWidth="3"/>
      {/* facets */}
      <polygon points="17,4 30,17 17,30 4,17" fill="#fff" opacity=".18"/>
      <polygon points="17,4 30,17 17,17" fill="#000" opacity=".12"/>
      <circle cx="12" cy="9" r="5" fill="#fff" opacity=".3"/> {/* specular */}
    </svg>
  );
}
