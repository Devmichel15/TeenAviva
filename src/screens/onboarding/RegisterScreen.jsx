import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import OnboardingLayout from "../../components/onboarding/OnboardingLayout";
import PrimaryButton from "../../components/onboarding/PrimaryButton";
import SocialButton from "../../components/onboarding/SocialButton";
import Input from "../../components/onboarding/Input";
import { colors, spacing } from "../../constants/theme";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <OnboardingLayout>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoWrap}>
            <Image
              style={styles.logo}
              source={require("../../../public/logo.png")}
            />
          </View>

          <Text style={styles.title}>
            Pronto para{"\n"}avivar a <Text style={styles.goldText}>Fé</Text>?
          </Text>

          <Text style={styles.subtitle}>
            Cria a tua conta e começa a tua jornada de fé hoje.
          </Text>

          <View style={styles.socialRow}>
            <SocialButton
              text="Continuar com o Google"
              icon={<FontAwesome6 name="google" size={20} color="#fff" />}
            />
            <SocialButton
              text="Continuar com Apple"
              icon={<FontAwesome6 name="apple" size={22} color="#fff" />}
            />
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou com email</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.inputs}>
            <Input
              placeholder="O teu email"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              placeholder="cria a tua password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <PrimaryButton text="Criar Conta" />
        </ScrollView>
      </KeyboardAvoidingView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingTop: spacing.xxxl,
    paddingBottom: 40,
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  logo: {
    width: 60,
    height: 52.5,
  },
  title: {
    fontSize: 32,
    color: colors.white,
    fontFamily: "ManropeBold",
    lineHeight: 38,
  },
  goldText: {
    color: colors.gold,
  },
  subtitle: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "ManropeLight",
    opacity: 0.8,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  socialRow: {
    gap: 10,
    marginBottom: spacing.lg,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  dividerText: {
    color: colors.placeholder,
    fontSize: 12,
    fontFamily: "ManropeRegular",
  },
  inputs: {
    gap: 10,
    marginBottom: spacing.md,
  },
});
