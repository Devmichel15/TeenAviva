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
import { FontAwesome6 } from "@expo/vector-icons";
import OnboardingLayout from "../../components/onboarding/OnboardingLayout";
import PrimaryButton from "../../components/onboarding/PrimaryButton";
import SocialButton from "../../components/onboarding/SocialButton";
import Input from "../../components/onboarding/Input";
import { colors, spacing } from "../../constants/theme";
import useAuth from "../../hooks/useAuth";
import useGoogleAuth from "../../hooks/useGoogleAuth";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const { promptGoogleLogin, googleLoading, googleDisabled, googleError } =
    useGoogleAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleRegister() {
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError("Insere o teu email");
      return;
    }
    if (!password.trim()) {
      setError("Insere a tua password");
      return;
    }

    setLoading(true);
    const result = await register(email.trim(), password);
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      setSuccess("Conta criada com sucesso!");
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
            Pronto para{"\n"}avivar a <Text style={styles.goldText}>Fé</Text>?
          </Text>

          <Text style={styles.subtitle}>
            Cria a tua conta e começa a tua jornada de fé hoje.
          </Text>

          {googleError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{googleError}</Text>
            </View>
          )}

          <View style={styles.socialRow}>
            <SocialButton
              text="Continuar com o Google"
              icon={
                googleLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <FontAwesome6 name="google" size={20} color="#fff" />
                )
              }
              onPress={promptGoogleLogin}
              disabled={googleDisabled || googleLoading}
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

          <PrimaryButton
            text={loading ? "A criar conta..." : "Criar Conta"}
            onPress={handleRegister}
          />
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
    fontFamily: "ManropeMedium",
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
    fontFamily: "ManropeMedium",
    textAlign: "center",
  },
});
