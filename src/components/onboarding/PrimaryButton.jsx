import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, borderRadius } from "../../constants/theme";

export default function PrimaryButton({ text, onPress, style, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.lightGreen,
    paddingVertical: 16,
    borderRadius: borderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: colors.black,
    fontSize: 16,
    fontFamily: "ManropeSemiBold",
  },
  disabledText: {
    opacity: 0.8,
  },
});
