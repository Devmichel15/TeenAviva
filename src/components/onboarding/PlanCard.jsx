import { Text, View, StyleSheet } from "react-native";
import { BookOpen } from "lucide-react-native";
import AnimatedPressable from "../ui/AnimatedPressable";
import { colors, borderRadius } from "../../constants/theme";

export default function PlanCard({ title, selected, onPress }) {
  return (
    <AnimatedPressable onPress={onPress} scaleTo={0.97}>
      <View style={[styles.card, selected && styles.cardSelected]}>
        <BookOpen
          color={selected ? colors.gold : colors.white}
          size={20}
        />
        <Text style={[styles.title, selected && styles.titleSelected]}>
          {title}
        </Text>
        {selected && <View style={styles.check} />}
      </View>
    </AnimatedPressable>
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
  cardSelected: {
    backgroundColor: colors.goldBg,
    borderColor: colors.goldBorder,
  },
  title: {
    color: colors.white,
    fontSize: 14,
    fontFamily: "ManropeSemiBold",
    flex: 1,
  },
  titleSelected: {
    color: colors.gold,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
});
