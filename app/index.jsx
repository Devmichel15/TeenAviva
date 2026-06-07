import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Splash() {
  return (
    <View style={s.container}>
      <Text style={s.title}>TeenAviva</Text>
      <TouchableOpacity
        style={s.btn}
        onPress={() => router.replace("/tabs/")}
      >
        <Text style={s.btnTxt}>Começar</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1410",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  title: { fontSize: 36, fontWeight: "200", color: "#fff", letterSpacing: 4 },
  btn: {
    backgroundColor: "#A3B18A",
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  btnTxt: { fontSize: 16, fontWeight: "600", color: "#1C1410" },
});
