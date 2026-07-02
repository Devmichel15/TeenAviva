import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, borderRadius } from "../../constants/theme";

export default function SocialButton({ text, icon, onPress }) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon}
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    gap: 10,
  },
  text: {
    color: colors.white,
    fontSize: 15,
    fontFamily: "ManropeMedium",
  },
});
