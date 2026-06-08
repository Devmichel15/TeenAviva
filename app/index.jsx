import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import {colors} from "../src/styles/colors.js"
import { TextComp } from "../src/components/Text.jsx";

export default function Splash() {
  return (
    <View style={s.container}>
      <Image
        source={require("../public/logo.png")}
        style={{ width: 99.5, height: 87.16, alignSelf: "center", marginTop: 100 }}
      />
      <TextComp weight="bold" variant="body" content="Teen Aviva"/>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
  }
  
});
