import { StyleSheet, Text, View } from "react-native";
import { Book, ScrollText, Languages } from "lucide-react-native";
import OnboardingLayout from "../../components/onboarding/OnboardingLayout";
import PrimaryButton from "../../components/onboarding/PrimaryButton";
import Indicator from "../../components/onboarding/Indicator";
import { colors, spacing, borderRadius } from "../../constants/theme";

export default function ContextScreen({ onNext }) {
  return (
    <OnboardingLayout>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.label}>Contexto & Meditação</Text>

          <Text style={styles.title}>A palavra com</Text>
          <Text style={styles.goldText}>Profundidade real.</Text>

          <View style={styles.verseCard}>
            <Book color={colors.gold} size={24} style={styles.verseIcon} />
            <View style={styles.verseContent}>
              <Text style={styles.verseRef}>Salmos 119:105</Text>
              <Text style={styles.verseText}>
                "Lâmpada para os meus pés é a tua palavra e luz para o meu caminho."
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.infoCard, { marginRight: 8 }]}>
              <ScrollText color={colors.white} size={22} style={styles.infoIcon} />
              <Text style={styles.infoTitle}>Contexto{"\n"}Histórico</Text>
              <Text style={styles.infoDesc}>
                Entende o ambiente e a cultura por trás do texto.
              </Text>
            </View>

            <View style={[styles.infoCard, { marginLeft: 8 }]}>
              <Languages color={colors.white} size={22} style={styles.infoIcon} />
              <Text style={styles.infoTitle}>Língua{"\n"}Original</Text>
              <Text style={styles.infoDesc}>
                Explora o significado das palavras originais.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottom}>
          <PrimaryButton text="Continuar" onPress={onNext} />
          <Indicator total={4} activeIndex={2} />
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
    color: colors.streakGreen,
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
    marginBottom: spacing.lg,
  },
  verseCard: {
    flexDirection: "row",
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.md,
    padding: 16,
    gap: 12,
    marginBottom: spacing.md,
  },
  verseIcon: {
    marginTop: 2,
  },
  verseContent: {
    flex: 1,
  },
  verseRef: {
    color: colors.gold,
    fontSize: 13,
    fontFamily: "ManropeSemiBold",
    marginBottom: 4,
  },
  verseText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "ManropeRegular",
    opacity: 0.85,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.md,
    padding: 14,
  },
  infoIcon: {
    marginBottom: 8,
  },
  infoTitle: {
    color: colors.white,
    fontSize: 14,
    fontFamily: "ManropeSemiBold",
    lineHeight: 20,
    marginBottom: 6,
  },
  infoDesc: {
    color: colors.white,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "ManropeLight",
    opacity: 0.7,
  },
  bottom: {
    gap: spacing.lg,
  },
});
