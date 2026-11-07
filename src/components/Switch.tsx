import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet } from "react-native";

import { colors, metrics, shadows } from "@/theme";
import { Touchable } from "./Touchable";

const m = metrics.switch;
const TRAVEL = m.width - m.knob - m.padding * 2;

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  disabled?: boolean;
}

/** 50×30 switch. On = Majorelle, off = light grey; the knob position also shows the state. */
export function Switch({ value, onValueChange, accessibilityLabel, disabled }: SwitchProps) {
  // useState (not useRef) so the animated value is stable without reading a ref during render.
  const [progress] = useState(() => new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [value, progress]);

  const backgroundColor = progress.interpolate({ inputRange: [0, 1], outputRange: [colors.borderStrong, colors.primary] });
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, TRAVEL] });

  return (
    <Touchable
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      hitSlop={(metrics.iconButton.size - m.height) / 2}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      aria-checked={value}
      aria-disabled={disabled}
      pressedOpacity={0.9}
    >
      <Animated.View style={[styles.track, { backgroundColor }]}>
        <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
      </Animated.View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  track: { width: m.width, height: m.height, borderRadius: m.height / 2, padding: m.padding, justifyContent: "center" },
  knob: {
    width: m.knob,
    height: m.knob,
    borderRadius: m.knob / 2,
    backgroundColor: colors.white,
    boxShadow: shadows.knob,
  },
});
