import { Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../constants/theme';
import AnimatedPressable from './AnimatedPressable';

export default function Chip({
  label,
  selected,
  onPress,
  variant = 'default',
  style,
}) {
  const variantStyles = {
    default: {
      bg: selected ? colors.sageBg : colors.white04,
      border: selected ? colors.sageBorder : 'rgba(255,255,255,0.1)',
      text: selected ? colors.sage : 'rgba(255,255,255,0.55)',
    },
    sage: {
      bg: selected ? colors.sageBg : colors.white04,
      border: selected ? colors.sageBorder : 'rgba(255,255,255,0.1)',
      text: colors.sage,
    },
    gold: {
      bg: 'rgba(201,151,58,0.07)',
      border: 'rgba(201,151,58,0.28)',
      text: colors.gold,
    },
    ai: {
      bg: 'rgba(163,177,138,0.07)',
      border: 'rgba(163,177,138,0.28)',
      text: colors.sage,
    },
  };

  const v = variantStyles[variant] || variantStyles.default;

  return (
    <AnimatedPressable onPress={onPress} scaleTo={0.94}>
      <Text
        style={[
          styles.chip,
          {
            backgroundColor: v.bg,
            borderColor: v.border,
            color: v.text,
          },
          style,
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    fontSize: 10,
    fontFamily: 'ManropeRegular',
    overflow: 'hidden',
  },
});
