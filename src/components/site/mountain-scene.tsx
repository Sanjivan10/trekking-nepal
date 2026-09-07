/**
 * Minimal Himalayan skyline for the footer: layered ridges, a snow cap, a
 * line of trekkers walking the ridge, and prayer flags.
 *
 * Pure inline SVG — no images, no JS, a couple of KB. Colours come from
 * settings so the whole scene is editable from /admin/footer.
 */

type Props = {
  mountainColor: string;
  mountainColor2: string;
  snowColor: string;
  trekkerColor: string;
  height: number;
  showTrekkers: boolean;
  showPrayerFlags: boolean;
  showStars: boolean;
};

/** One walking figure: pack, poles, mid-stride legs. */
function Trekker({
  x,
  y,
  scale = 1,
  color,
  flip = false,
}: {
  x: number;
  y: number;
  scale?: number;
  color: string;
  flip?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
      fill={color}
      stroke={color}
      strokeLinecap="round"
    >
      {/* head */}
      <circle cx="0" cy="-15.5" r="2.4" stroke="none" />
      {/* backpack */}
      <rect x="-4.6" y="-13.4" width="3.6" height="6.2" rx="1.4" stroke="none" opacity="0.85" />
      {/* torso */}
      <path d="M0 -13 L0.6 -6.2" strokeWidth="2.5" fill="none" />
      {/* legs, mid-stride */}
      <path d="M0.6 -6.2 L-2.2 0" strokeWidth="2.1" fill="none" />
      <path d="M0.6 -6.2 L3.4 0" strokeWidth="2.1" fill="none" />
      {/* forward arm + trekking pole */}
      <path d="M0.2 -11.4 L3.2 -7.6" strokeWidth="1.7" fill="none" />
      <path d="M3.2 -7.6 L4.4 0.4" strokeWidth="0.9" fill="none" opacity="0.75" />
    </g>
  );
}

export function MountainScene({
  mountainColor,
  mountainColor2,
  snowColor,
  trekkerColor,
  height,
  showTrekkers,
  showPrayerFlags,
  showStars,
}: Props) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none w-full select-none overflow-hidden"
      style={{ height }}
    >
      <svg
        viewBox="0 0 1200 160"
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full"
        role="presentation"
        focusable="false"
      >
        {showStars && (
          <g fill={snowColor} opacity="0.5">
            {[
              [90, 22, 1.1], [180, 40, 0.8], [265, 18, 1.3], [340, 46, 0.7],
              [430, 26, 1], [560, 16, 1.2], [640, 42, 0.8], [720, 24, 1],
              [830, 38, 0.9], [910, 20, 1.2], [1010, 44, 0.8], [1120, 28, 1.1],
            ].map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} opacity={0.35 + (i % 4) * 0.18} />
            ))}
          </g>
        )}

        {/* Far ridge */}
        <path
          d="M0 160 L0 104 L95 62 L150 88 L232 40 L300 84 L370 58 L455 100 L540 66
             L615 96 L700 54 L780 92 L868 48 L940 86 L1025 60 L1105 96 L1200 68 L1200 160 Z"
          fill={mountainColor2}
          opacity="0.75"
        />

        {/* Near ridge — the one the trekkers walk */}
        <path
          d="M0 160 L0 132 L120 108 L215 128 L318 78 L395 112 L470 96 L560 130
             L648 92 L735 122 L818 100 L900 134 L985 110 L1075 130 L1200 106 L1200 160 Z"
          fill={mountainColor}
        />

        {/* Snow caps on the two highest peaks */}
        <path d="M232 40 L258 62 L245 60 L236 66 L226 58 L214 62 Z" fill={snowColor} opacity="0.9" />
        <path d="M868 48 L893 70 L881 67 L871 73 L861 66 L849 70 Z" fill={snowColor} opacity="0.9" />
        <path d="M318 78 L340 96 L330 94 L322 99 L313 93 L303 96 Z" fill={snowColor} opacity="0.55" />

        {showPrayerFlags && (
          <g>
            {/* Line strung from the near summit down the slope */}
            <path
              d="M318 78 Q 360 74 400 92"
              stroke={snowColor}
              strokeWidth="0.7"
              fill="none"
              opacity="0.45"
            />
            {[
              [330, 79.5, "#e5484d"], [344, 78.5, "#f5c542"],
              [358, 79.5, "#3aa6ff"], [372, 82.5, "#4bc98a"],
              [386, 87, "#f0f2f6"],
            ].map(([x, y, fill], i) => (
              <path
                key={i}
                d={`M${x} ${y} l0 7 l4.6 -1.6 l0 -7 z`}
                fill={fill as string}
                opacity="0.8"
              />
            ))}
          </g>
        )}

        {showTrekkers && (
          <g>
            {/* Walking up the near ridge toward the summit */}
            <Trekker x={470} y={96} scale={1.05} color={trekkerColor} />
            <Trekker x={512} y={112} scale={0.95} color={trekkerColor} />
            <Trekker x={548} y={126} scale={0.85} color={trekkerColor} />
            {/* A lone figure cresting the far side */}
            <Trekker x={735} y={122} scale={0.9} color={trekkerColor} flip />
          </g>
        )}
      </svg>
    </div>
  );
}
