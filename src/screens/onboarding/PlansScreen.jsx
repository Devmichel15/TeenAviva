import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import OnboardingLayout from "../../components/onboarding/OnboardingLayout";
import PrimaryButton from "../../components/onboarding/PrimaryButton";
import Indicator from "../../components/onboarding/Indicator";
import PlanCard from "../../components/onboarding/PlanCard";
import { colors, spacing } from "../../constants/theme";

const plans = [
  "Ansiedade — O que Deus diz",
  "Identidade em Cristo",
  "Amizades segundo Deus",
];

export default function PlansScreen() {
  const router = useRouter();

  return (
    <OnboardingLayout>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.label}>Feito pra tua Geração</Text>

          <Text style={styles.title}>Escolha o teu</Text>
          <Text style={styles.goldText}>Plano de leitura</Text>

          <View style={styles.list}>
            {plans.map((plan, i) => (
              <PlanCard key={i} title={plan} />
            ))}
          </View>
        </View>

        <View style={styles.bottom}>
          <PrimaryButton text="Continuar" onPress={() => router.push("/register")} />
          <Indicator total={4} activeIndex={3} />
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
    marginBottom: spacing.lg,
  },
  list: {
    gap: 10,
  },
  bottom: {
    gap: spacing.lg,
  },
});
