import { useState } from "react";
import {
  ActivityIndicator,
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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleLogin() {
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError("Insere o teu email");
      return;
    }
    if (!password) {
      setError("Insere a tua palavra-passe");
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      router.replace("/home");
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
            Bem-vindo{"\n"}de <Text style={styles.goldText}>volta</Text>
          </Text>

          <Text style={styles.subtitle}>
            Inicia sessão para continuar a tua jornada de fé.
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
            <Input
              placeholder="A tua palavra-passe"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Text
            style={styles.forgotPassword}
            onPress={() => router.push("/forgot-password")}
          >
            Esqueceu a palavra-passe?
          </Text>

          <PrimaryButton
            text={loading ? "A iniciar sessão..." : "Iniciar Sessão"}
            onPress={handleLogin}
            disabled={loading}
          />

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Ainda não tens conta? </Text>
            <Text
              style={styles.registerLink}
              onPress={() => router.push("/register")}
            >
              Criar conta
            </Text>
          </View>
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
  inputs: {
    gap: 10,
    marginBottom: spacing.sm,
  },
  forgotPassword: {
    color: colors.gold,
    fontSize: 13,
    fontFamily: "ManropeSemiBold",
    textAlign: "right",
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
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  registerText: {
    color: colors.placeholder,
    fontSize: 14,
    fontFamily: "ManropeRegular",
  },
  registerLink: {
    color: colors.gold,
    fontSize: 14,
    fontFamily: "ManropeSemiBold",
  },
});
