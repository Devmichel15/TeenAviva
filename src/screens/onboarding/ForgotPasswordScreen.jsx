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
import { useRouter } from "expo-router";
import OnboardingLayout from "../../components/onboarding/OnboardingLayout";
import PrimaryButton from "../../components/onboarding/PrimaryButton";
import Input from "../../components/onboarding/Input";
import { colors, spacing } from "../../constants/theme";
import useAuth from "../../hooks/useAuth";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleResetPassword() {
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError("Insere o teu email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Insere um email válido");
      return;
    }

    setLoading(true);
    const result = await resetPassword(email.trim());
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      setSuccess("Email de recuperação enviado. Verifica a tua caixa de entrada.");
    }
  }

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
            Recuperar{"\n"}palavra-passe
          </Text>

          <Text style={styles.subtitle}>
            Insere o teu email e enviaremos as instruções para repor a palavra-passe.
          </Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {success && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{success}</Text>
            </View>
          )}

          <View style={styles.inputs}>
            <Input
              placeholder="O teu email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <PrimaryButton
            text={loading ? "A enviar..." : "Enviar email de recuperação"}
            onPress={handleResetPassword}
            disabled={loading}
          />

          <Text
            style={styles.backLink}
            onPress={() => router.push("/login")}
          >
            Voltar ao login
          </Text>
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
  subtitle: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "ManropeLight",
    opacity: 0.8,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  inputs: {
    gap: 10,
    marginBottom: spacing.md,
  },
  errorBox: {
    backgroundColor: "rgba(255, 80, 80, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 80, 80, 0.4)",
    borderRadius: 12,
    padding: 12,
    marginBottom: spacing.md,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 13,
    fontFamily: "ManropeSemiBold",
    textAlign: "center",
  },
  successBox: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.4)",
    borderRadius: 12,
    padding: 12,
    marginBottom: spacing.md,
  },
  successText: {
    color: "#81c784",
    fontSize: 13,
    fontFamily: "ManropeSemiBold",
    textAlign: "center",
  },
  backLink: {
    color: colors.gold,
    fontSize: 14,
    fontFamily: "ManropeSemiBold",
    textAlign: "center",
    marginTop: spacing.md,
  },
});
