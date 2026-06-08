import { Text, TouchableOpacity } from "react-native";

export const Button = ({ text, style, styleText }) => {
  return (
    <TouchableOpacity style={style}>
      <Text style={styleText}>{text}</Text>
    </TouchableOpacity>
  );
};
