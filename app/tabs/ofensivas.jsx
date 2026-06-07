import { View, Text, StyleSheet } from "react-native";

export default function Ofensiva() {
  return (
    <View style={s.container}>
      <Text style={s.txt}>Ofensiva 🔥</Text>
    </View>
  );
}


const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1410",
    justifyContent: "center",
    alignItems: "center",
  },
  txt: { fontSize: 24, color: "#fff", fontWeight: "200" },
});
