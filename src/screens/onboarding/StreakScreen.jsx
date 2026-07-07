import { StyleSheet, Text, View } from "react-native";
import { Flame } from "lucide-react-native";
import OnboardingLayout from "../../components/onboarding/OnboardingLayout";
import PrimaryButton from "../../components/onboarding/PrimaryButton";
import Indicator from "../../components/onboarding/Indicator";
import { colors, spacing, borderRadius } from "../../constants/theme";

const daysOfWeek = ["D", "S", "T", "Q", "Q", "S", "S"];

export default function StreakScreen({ onNext }) {
  return (
    <OnboardingLayout>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.label}>Chama da Fé</Text>

          <Text style={styles.title}>Lê todos{"\n"}os dias.</Text>

          <Text style={styles.goldText}>Não quebre.</Text>

          <Text style={styles.description}>
            mantém a tua Chama acesa e fortalece a tua fé com a leitura diária da palavra.
          </Text>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.fireRow}>
                <Flame color={colors.white} size={20} />
                <Text style={styles.cardTitle}>14 dias de Chama</Text>
              </View>
            </View>

            <View style={styles.daysRow}>
              {daysOfWeek.map((day, i) => (
                <View key={i} style={[styles.dayCircle, i === 5 && styles.dayActive]}>
                  <Text style={[styles.dayText, i === 5 && styles.dayTextActive]}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.bottom}>
          <PrimaryButton text="Continuar" onPress={onNext} />
          <Indicator total={4} activeIndex={1} />
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    paddingTop: spacing.xxxl,
  },
  label: {
    color: colors.gold,
    fontSize: 14,
    fontFamily: "ManropeSemiBold",
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 36,
    color: colors.white,
    fontFamily: "ManropeBold",
    lineHeight: 42,
  },
  goldText: {
    color: colors.gold,
    fontSize: 36,
    fontFamily: "ManropeBold",
    lineHeight: 42,
    marginBottom: spacing.md,
  },
  description: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "ManropeLight",
    opacity: 0.8,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.lg,
    padding: 20,
  },
  cardHeader: {
    marginBottom: spacing.md,
  },
  fireRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  cardTitle: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "ManropeSemiBold",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  dayActive: {
    backgroundColor: colors.streakGreen,
  },
  dayText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: "ManropeSemiBold",
    opacity: 0.5,
  },
  dayTextActive: {
    opacity: 1,
  },
  bottom: {
    gap: spacing.lg,
  },
});
