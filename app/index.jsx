import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { colors } from "../src/styles/colors.js";
import { TextComp } from "../src/components/Text.jsx";
import { Onboarding } from "../src/components/Onboarding.jsx";
import { StatusBar } from "expo-status-bar";

export default function Splash() {
  return (
    <View style={s.container}>
      <StatusBar style="dark" />
      <Onboarding />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
});
