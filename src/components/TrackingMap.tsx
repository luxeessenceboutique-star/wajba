/**
 * Mock street map from screens/source/Track.dc.html (390 × 440 drawing) with
 * the route kitchen → rider → destination. The rider marker moves along the
 * route with `progress` (0 = at the kitchen, 1 = delivered). A real map
 * provider replaces this later.
 */
import { View } from "react-native";
import Svg, { Circle, G, Path, Rect, Text as SvgText } from "react-native-svg";

import { colors, fontFamily, metrics } from "@/theme";

type Point = [number, number];

/** Route from the design: kitchen (91,365) → … → destination (331,109). */
const ROUTE: Point[] = [[91, 365], [91, 244], [229, 244], [229, 180], [229, 109], [331, 109]];

const BLOCKS: [number, number, number, number][] = [
  [8, 16, 70, 80], [104, 16, 112, 80], [242, 16, 76, 80], [344, 16, 46, 80],
  [8, 122, 70, 104], [242, 122, 76, 104], [344, 122, 46, 104],
  [8, 262, 70, 90], [104, 262, 112, 90], [242, 262, 76, 90], [344, 262, 46, 90],
  [8, 378, 70, 62], [104, 378, 112, 62], [242, 378, 148, 62],
];

function length(a: Point, b: Point) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

/** Split the route at fraction t: [travelled points, remaining points]. */
function splitRoute(t: number): [Point[], Point[]] {
  const total = ROUTE.slice(1).reduce((sum, p, i) => sum + length(ROUTE[i], p), 0);
  let target = Math.min(1, Math.max(0, t)) * total;
  for (let i = 1; i < ROUTE.length; i++) {
    const seg = length(ROUTE[i - 1], ROUTE[i]);
    if (target <= seg) {
      const r = seg === 0 ? 0 : target / seg;
      const at: Point = [ROUTE[i - 1][0] + (ROUTE[i][0] - ROUTE[i - 1][0]) * r, ROUTE[i - 1][1] + (ROUTE[i][1] - ROUTE[i - 1][1]) * r];
      return [[...ROUTE.slice(0, i), at], [at, ...ROUTE.slice(i)]];
    }
    target -= seg;
  }
  return [ROUTE, [ROUTE[ROUTE.length - 1]]];
}

const toPath = (points: Point[]) => points.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");

export interface TrackingMapProps {
  progress: number;
  streetName?: string;
  accessibilityLabel: string;
}

export function TrackingMap({ progress, streetName, accessibilityLabel }: TrackingMapProps) {
  const { width, height } = metrics.trackingMap;
  const [done, rest] = splitRoute(progress);
  const rider = done[done.length - 1];
  const kitchen = ROUTE[0];
  const destination = ROUTE[ROUTE.length - 1];

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={{ height }}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice">
        <Rect width={width} height={height} fill={colors.mapBackground} />
        <G fill={colors.mapBlock}>
          {BLOCKS.map(([x, y, w, h]) => (
            <Rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx={10} />
          ))}
        </G>
        <Rect x="104" y="122" width="112" height="104" rx="12" fill={colors.mapPark} />
        <G stroke={colors.white} strokeLinecap="round" fill="none">
          <Path d="M0 109H390M0 365H390M91 0V440M229 0V440M331 0V440" strokeWidth={12} />
          <Path d="M0 244H390" strokeWidth={22} />
        </G>
        {streetName && (
          <SvgText x="252" y="240" fontFamily={fontFamily[700]} fontSize={11} fill={colors.mutedLight}>
            {streetName}
          </SvgText>
        )}
        {rest.length > 1 && <Path d={toPath(rest)} fill="none" stroke={colors.primary} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 11" />}
        {done.length > 1 && <Path d={toPath(done)} fill="none" stroke={colors.primary} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />}
        {/* Kitchen (tajine) */}
        <G transform={`translate(${kitchen[0]} ${kitchen[1]})`}>
          <Circle r="16" fill={colors.terracotta} />
          <Path d="M-7 3h14l-2 4h-10z M-6 2c2-2 3-7 5-9h2c2 2 3 7 5 9z" fill={colors.white} />
        </G>
        {/* Destination */}
        <G transform={`translate(${destination[0]} ${destination[1]})`}>
          <Circle r="20" fill={colors.ink} fillOpacity={0.12} />
          <Circle r="12" fill={colors.ink} />
          <Circle r="4.5" fill={colors.white} />
        </G>
        {/* Rider (scooter) */}
        <G transform={`translate(${rider[0].toFixed(1)} ${rider[1].toFixed(1)})`}>
          <Circle r="28" fill={colors.primary} fillOpacity={0.16} />
          <Circle r="18" fill={colors.primary} stroke={colors.white} strokeWidth={3} />
          <G fill="none" stroke={colors.white} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="-6.5" cy="5" r="3.3" />
            <Circle cx="6.5" cy="5" r="3.3" />
            <Path d="M-3 5H3l2-8h3M-6.5 1.5V-2h5" />
          </G>
        </G>
      </Svg>
    </View>
  );
}
