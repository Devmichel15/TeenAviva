import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { TextComp } from "../src/components/Text";
import { colors } from "../src/styles/colors";
import { Fonts } from "../src/styles/fonts";
import { Button } from "../src/components/Button";

export const Home = () => {
  return (
    <ImageBackground
      source={require("../public/bg-img.png")}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../public/logo.png")}
          />
          <TextComp
            content="Teen Aviva"
            variant="title"
            weight="light"
            style={{ color: "white", letterSpacing: 3 }}
          />
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.heading}>
            Aviva {"\n"}a tua <Text style={styles.goldenText}>fé</Text>
          </Text>

          <TextComp
            content="Mais do que um app.Um movimento de avivamento."
            variant="body"
            weight="light"
            style={styles.desq}
          />
          <Button
            text="Começar"
            style={styles.button}
            styleText={styles.buttonText}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "start",
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 99.5,
    height: 87.16,
  },
  heading: {
    fontSize: 64,
    color: colors.white,
    fontFamily: Fonts.regular,
    lineHeight: 50,
  },
  bottomContainer: {
    marginBottom: 50,
  },
  goldenText: {
    color: colors.gold,
  },
  desq: {
    color: colors.white,
    marginTop: 35,
    fontSize: 25,
    lineHeight: 30,
  },
  button: {
    backgroundColor: colors.lightGreen,
    padding: 15,
    borderRadius: 30,
    marginTop: 40,
  },
  buttonText: {
    textAlign: "center",
    color: colors.black,
  },
});
