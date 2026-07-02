import { View, StyleSheet, Animated } from "react-native";
import { colors } from "../../constants/theme";

export default function Indicator({ total, activeIndex }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === activeIndex && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.inactiveDot,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.gold,
    borderRadius: 4,
  },
});
