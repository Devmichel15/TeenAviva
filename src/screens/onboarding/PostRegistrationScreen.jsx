import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import OnboardingLayout from "../../components/onboarding/OnboardingLayout";
import PrimaryButton from "../../components/onboarding/PrimaryButton";
import PlanCard from "../../components/onboarding/PlanCard";
import { colors, spacing } from "../../constants/theme";
import { UserService, UserPlanService } from "../../services/firestore.service";

const plans = [
  { id: "pl_anxiety", title: "Ansiedade — O que Deus diz" },
  { id: "pl_identity", title: "Identidade em Cristo" },
  { id: "pl_friendship", title: "Amizades segundo Deus" },
];

export default function PostRegistrationScreen({ user }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleComplete() {
    setSaving(true);

    if (selectedIndex !== null) {
      const plan = plans[selectedIndex];
      await UserPlanService.create(user.uid, plan, {
        id: plan.id,
        title: plan.title,
        duration: 7,
        icon: "book",
        iconColor: "#C5A55A",
      });
    }

    await UserService.update(user.uid, { onboardingCompleted: true });
  }

  return (
    <OnboardingLayout>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Tudo pronto!</Text>

          <Text style={styles.subtitle}>
            Escolhe o teu primeiro plano de leitura para começar a jornada
          </Text>

          <View style={styles.list}>
            {plans.map((plan, i) => (
              <PlanCard
                key={plan.id}
                title={plan.title}
                selected={selectedIndex === i}
                onPress={() => setSelectedIndex(i)}
              />
            ))}
          </View>
        </View>

        <PrimaryButton
          text={saving ? "A preparar tudo..." : "Começar jornada"}
          onPress={handleComplete}
          disabled={saving}
        />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacing.xxxl,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    color: colors.white,
    fontFamily: "ManropeBold",
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 14,
    color: colors.white,
    fontFamily: "ManropeLight",
    opacity: 0.8,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  list: {
    gap: 10,
  },
});
