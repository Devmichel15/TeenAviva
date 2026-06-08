import { Text } from "react-native";
import { Fonts } from "../styles/fonts";

export function TextComp({ content, weight = "regular", variant = "body", style }) {
  const fontFamily = Fonts[weight] || Fonts.regular;

  const variants = {
    title: { fontSize: 24, lineHeight: 32 },
    body: { fontSize: 14, lineHeight: 20 },
    caption: { fontSize: 12, lineHeight: 16 },
    small: { fontSize: 10, lineHeight: 14 },
  };

  return (
    <Text style={[{ fontFamily }, variants[variant], style]}>{content}</Text>
  );
}
