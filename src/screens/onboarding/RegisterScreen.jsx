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
import Input from "../../components/onboarding/Input";
import { colors, spacing } from "../../constants/theme";
import useAuth from "../../hooks/useAuth";
export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function validate() {
    if (!name.trim()) {
      return "Insere o teu nome completo";
    }
    if (name.trim().length < 2) {
      return "O nome deve ter pelo menos 2 caracteres";
    }
    if (!email.trim()) {
      return "Insere o teu email";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Insere um email válido";
    }
    if (!age.trim()) {
      return "Insere a tua idade";
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum !== parseFloat(age)) {
      return "A idade deve ser um número inteiro";
    }
    if (ageNum < 13) {
      return "Deves ter pelo menos 13 anos";
    }
    if (!password) {
      return "Insere a tua palavra-passe";
    }
    if (password.length < 8) {
      return "A palavra-passe deve ter pelo menos 8 caracteres";
    }
    if (password !== confirmPassword) {
      return "As palavras-passe não coincidem";
    }
    return null;
  }

  async function handleRegister() {
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const result = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      age: parseInt(age, 10),
    });
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      router.replace("/");
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
              placeholder="Nome completo"
              value={name}
              onChangeText={setName}
            />
            <Input
              placeholder="O teu email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              placeholder="Idade"
              keyboardType="numeric"
              maxLength={2}
              value={age}
              onChangeText={setAge}
            />
            <Input
              placeholder="Cria a tua palavra-passe"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Input
              placeholder="Confirma a tua palavra-passe"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <PrimaryButton
            text={loading ? "A criar conta..." : "Criar Conta"}
            onPress={handleRegister}
            disabled={loading}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tens conta? </Text>
            <Text style={styles.loginLink} onPress={() => router.push("/login")}>
              Iniciar sessão
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
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  loginText: {
    color: colors.placeholder,
    fontSize: 14,
    fontFamily: "ManropeRegular",
  },
  loginLink: {
    color: colors.gold,
    fontSize: 14,
    fontFamily: "ManropeSemiBold",  },
});
