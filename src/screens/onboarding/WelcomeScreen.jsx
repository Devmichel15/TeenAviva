import { Image, StyleSheet, Text, View } from "react-native";
import OnboardingLayout from "../../components/onboarding/OnboardingLayout";
import PrimaryButton from "../../components/onboarding/PrimaryButton";
import Indicator from "../../components/onboarding/Indicator";
import { colors, spacing } from "../../constants/theme";

export default function WelcomeScreen({ onNext }) {
  return (
    <OnboardingLayout>
      <View style={styles.container}>
        <View style={styles.top}>
          <Image
            style={styles.logo}
            source={require("../../../public/logo.png")}
          />
        </View>

        <View style={styles.bottom}>
          <Text style={styles.heading}>
            Aviva {"\n"}a tua <Text style={styles.goldenText}>fé</Text>
          </Text>

          <Text style={styles.subtitle}>
            Mais do que um app.{"\n"}Um movimento de avivamento.
          </Text>

          <PrimaryButton
            text="Começar"
            onPress={onNext}
            style={styles.button}
          />
        </View>
      </View>
        <Indicator total={4} activeIndex={0} />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 40,
  },
  top: {
    alignItems: "center",
    paddingTop: spacing.xxxl,
  },
  logo: {
    width: 99.5,
    height: 87.16,
  },
  bottom: {
    alignItems: "flex-start",
  },
  heading: {
    fontSize: 70,
    color: colors.white,
    fontFamily: "ManropeRegular",
    lineHeight: 70,
  },
  goldenText: {
    color: colors.gold,
  },
  subtitle: {
    color: colors.white,
    marginTop: spacing.lg,
    fontSize: 18,
    lineHeight: 26,
    fontFamily: "ManropeLight",
  },
  button: {
    marginTop: spacing.xl,
    alignSelf: "stretch",
  },
});
