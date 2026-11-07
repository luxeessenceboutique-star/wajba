/**
 * Icon set taken from the design sources (screens/source/*.dc.html):
 * 24×24, 2 pt stroke, round caps — Lucide style. Some icons have a filled
 * version used for the active tab or a liked heart. Never emoji.
 */
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { colors, metrics } from "@/theme";

type Shape =
  | { d: string; knockout?: boolean }
  | { circle: [cx: number, cy: number, r: number] }
  | { rect: [x: number, y: number, w: number, h: number, rx: number] };

interface IconDef {
  shapes: Shape[];
  /** Filled variant; `knockout` shapes are drawn in the background color. */
  filled?: Shape[];
  /** Always drawn filled (e.g. the rating star). */
  solid?: boolean;
  strokeWidth?: number;
}

const icons = {
  search: { shapes: [{ circle: [11, 11, 7] }, { d: "M20 20l-3.5-3.5" }], strokeWidth: 2.2 },
  bell: { shapes: [{ d: "M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0" }] },
  chevronDown: { shapes: [{ d: "M6 9l6 6 6-6" }], strokeWidth: 2.6 },
  chevronLeft: { shapes: [{ d: "M15 5l-7 7 7 7" }] },
  chevronRight: { shapes: [{ d: "M9 6l6 6-6 6" }] },
  arrowRight: { shapes: [{ d: "M5 12h14M13 6l6 6-6 6" }] },
  close: { shapes: [{ d: "M6 6l12 12M18 6L6 18" }] },
  plus: { shapes: [{ d: "M12 5v14M5 12h14" }], strokeWidth: 2.4 },
  minus: { shapes: [{ d: "M5 12h14" }], strokeWidth: 2.4 },
  check: { shapes: [{ d: "M5 12.5l4.5 4.5L19 7.5" }], strokeWidth: 2.6 },
  heart: {
    shapes: [{ d: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" }],
    filled: [{ d: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" }],
    strokeWidth: 2.2,
  },
  star: { shapes: [{ d: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" }], solid: true },
  home: {
    shapes: [{ d: "M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6" }],
    filled: [{ d: "M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" }],
  },
  calendar: {
    shapes: [{ rect: [3, 5, 18, 16, 3] }, { d: "M3 10h18M8 3v4M16 3v4" }],
    filled: [{ d: "M6 3a1 1 0 0 1 2 0v1h8V3a1 1 0 0 1 2 0v1h1a3 3 0 0 1 3 3v2H2V7a3 3 0 0 1 3-3h1zM2 11h20v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" }],
  },
  receipt: {
    shapes: [{ d: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" }],
    filled: [{ d: "M6 3h12v18l-3-2-3 2-3-2-3 2z" }, { d: "M9 8h6M9 12h6", knockout: true }],
  },
  user: {
    shapes: [{ circle: [12, 8, 4] }, { d: "M4 21a8 8 0 0 1 16 0" }],
    filled: [{ circle: [12, 8, 4.5] }, { d: "M3.5 21a8.5 8.5 0 0 1 17 0z" }],
  },
  tag: { shapes: [{ d: "M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9z" }, { circle: [8, 8, 1.6] }] },
  gift: { shapes: [{ rect: [3, 8, 18, 13, 2] }, { d: "M12 8v13M3 12h18M12 8c-2-4-6-4-6-1s6 1 6 1 6 2 6-1-4-3-6 1" }] },
  globe: { shapes: [{ circle: [12, 12, 9] }, { d: "M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" }] },
  help: { shapes: [{ circle: [12, 12, 9] }, { d: "M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01" }] },
  mapPin: { shapes: [{ d: "M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" }, { circle: [12, 9.5, 2.5] }] },
  card: { shapes: [{ d: "M3 6h18v12H3zM3 10h18M7 15h4" }] },
  dumbbell: { shapes: [{ d: "M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12" }] },
  leaf: { shapes: [{ d: "M11 20A7 7 0 0 1 4 13c0-6 6-9 16-9 0 10-3 16-9 16zM4 20c3-6 6-8 10-10" }] },
  lock: { shapes: [{ rect: [5, 11, 14, 10, 2] }, { d: "M8 11V8a4 4 0 0 1 8 0v3" }] },
  chat: { shapes: [{ d: "M21 12a8 8 0 0 1-11.7 7L4 20l1.1-4.6A8 8 0 1 1 21 12z" }] },
  phone: { shapes: [{ d: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" }] },
  briefcase: { shapes: [{ d: "M5 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" }] },
  pause: { shapes: [{ d: "M9 6v12M15 6v12" }] },
  smartphone: { shapes: [{ d: "M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2" }] },
  apple: {
    shapes: [{ d: "M16 3c-1.5.2-3 1.4-3 3.2M12 8c-2-1-6-.5-6 5 0 4 2.5 8 4.5 8 1 0 1.5-.6 2.5-.6s1.5.6 2.5.6c1.6 0 3.2-2.4 3.8-4.6-1.8-.8-2.8-2.4-2.6-4.4.1-1.4 1-2.6 2.2-3.2C17.6 7 14.5 7 12 8z" }],
  },
  clock: { shapes: [{ circle: [12, 12, 9] }, { d: "M12 7v5l3 2" }] },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof icons;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  /** Use the filled variant when the icon has one (active tab, liked heart). */
  filled?: boolean;
  /** Color for knockout details of filled icons (the surface behind the icon). */
  knockoutColor?: string;
  strokeWidth?: number;
}

function renderShape(shape: Shape, key: number, paint: { fill: string; stroke: string; strokeWidth: number }) {
  const common = { fill: paint.fill, stroke: paint.stroke, strokeWidth: paint.strokeWidth, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if ("circle" in shape) return <Circle key={key} {...common} cx={shape.circle[0]} cy={shape.circle[1]} r={shape.circle[2]} />;
  if ("rect" in shape) {
    const [x, y, width, height, rx] = shape.rect;
    return <Rect key={key} {...common} x={x} y={y} width={width} height={height} rx={rx} />;
  }
  return <Path key={key} {...common} d={shape.d} />;
}

export function Icon({ name, size = metrics.icon.size, color = colors.ink, filled = false, knockoutColor = colors.white, strokeWidth }: IconProps) {
  const def: IconDef = icons[name];
  const stroke = strokeWidth ?? def.strokeWidth ?? metrics.icon.stroke;
  const useFilled = filled && def.filled;
  const shapes = useFilled ? def.filled! : def.shapes;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" pointerEvents="none">
      {shapes.map((shape, i) => {
        if (def.solid) return renderShape(shape, i, { fill: color, stroke: "none", strokeWidth: 0 });
        if (useFilled) {
          const knockout = "d" in shape && shape.knockout;
          return knockout
            ? renderShape(shape, i, { fill: "none", stroke: knockoutColor, strokeWidth: stroke })
            : renderShape(shape, i, { fill: color, stroke: color, strokeWidth: name === "heart" ? stroke : 0 });
        }
        return renderShape(shape, i, { fill: "none", stroke: color, strokeWidth: stroke });
      })}
    </Svg>
  );
}
