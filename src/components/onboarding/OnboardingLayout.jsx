import { ImageBackground, SafeAreaView, StyleSheet } from "react-native";

export default function OnboardingLayout({ children }) {
  return (
    <ImageBackground
      source={require("../../../public/bg-img.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.safe}>{children}</SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
