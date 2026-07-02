import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";
import useAuth from "../src/hooks/useAuth";
import { colors } from "../src/constants/theme";
import OnboardingFlow from "../src/screens/onboarding/OnboardingFlow";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/home" />;
  }

  return <OnboardingFlow />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
