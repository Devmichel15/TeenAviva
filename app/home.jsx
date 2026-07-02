import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useAuth from "../src/hooks/useAuth";
import { colors } from "../src/constants/theme";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo ao TeenAviva</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Terminar Sessão</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "space-between",
    padding: 24,
  },
  content: {
    alignItems: "center",
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    color: colors.white,
    fontFamily: "ManropeBold",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: colors.gold,
    fontFamily: "ManropeRegular",
  },
  button: {
    backgroundColor: colors.lightGreen,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: colors.black,
    fontSize: 16,
    fontFamily: "ManropeSemiBold",
  },
});
