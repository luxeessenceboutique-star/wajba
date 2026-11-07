import type { ReactNode } from "react";
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

import { metrics } from "@/theme";

export interface TouchableProps extends Omit<PressableProps, "style" | "children"> {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  /** Opacity while pressed. */
  pressedOpacity?: number;
}

/** Pressable with the app's standard pressed feedback. */
export function Touchable({ style, pressedOpacity = metrics.opacity.pressed, disabled, children, ...rest }: TouchableProps) {
  return (
    <Pressable
      {...rest}
      disabled={disabled}
      style={({ pressed }) => [style, pressed && !disabled && { opacity: pressedOpacity }]}
    >
      {children}
    </Pressable>
  );
}
