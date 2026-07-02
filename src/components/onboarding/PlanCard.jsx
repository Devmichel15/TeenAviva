import { Text, View, StyleSheet } from "react-native";
import { BookOpen } from "lucide-react-native";
import { colors, borderRadius } from "../../constants/theme";

export default function PlanCard({ title, onPress }) {
  return (
    <View style={styles.card}>
      <BookOpen color={colors.white} size={20} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.md,
    padding: 16,
    gap: 12,
  },
  title: {
    color: colors.white,
    fontSize: 14,
    fontFamily: "ManropeMedium",
    flex: 1,
  },
});
