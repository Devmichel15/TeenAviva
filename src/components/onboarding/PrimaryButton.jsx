import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, borderRadius } from "../../constants/theme";

export default function PrimaryButton({ text, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{text}</Text>
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
  text: {
    color: colors.black,
    fontSize: 16,
    fontFamily: "ManropeSemiBold",
  },
});
