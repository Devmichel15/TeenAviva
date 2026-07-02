import { useRef, useState, useCallback, useEffect } from "react";
import { Animated, Dimensions, PanResponder } from "react-native";
import WelcomeScreen from "./WelcomeScreen";
import StreakScreen from "./StreakScreen";
import ContextScreen from "./ContextScreen";
import PlansScreen from "./PlansScreen";

const { width } = Dimensions.get("window");

const screens = [
  WelcomeScreen,
  StreakScreen,
  ContextScreen,
  PlansScreen,
];

export default function OnboardingFlow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const animatingRef = useRef(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  const animateTo = useCallback(
    (targetIndex) => {
      if (animatingRef.current) return;
      animatingRef.current = true;

      Animated.spring(translateX, {
        toValue: -targetIndex * width,
        useNativeDriver: true,
        damping: 22,
        stiffness: 130,
      }).start(() => {
        setCurrentIndex(targetIndex);
        indexRef.current = targetIndex;
        animatingRef.current = false;
      });
    },
    [translateX]
  );

  const goToNext = useCallback(() => {
    if (indexRef.current >= screens.length - 1) return;
    animateTo(indexRef.current + 1);
  }, [animateTo]);

  const goBack = useCallback(() => {
    if (indexRef.current <= 0) return;
    animateTo(indexRef.current - 1);
  }, [animateTo]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,
      onPanResponderRelease: (_, g) => {
        const idx = indexRef.current;
        if (g.dx < -50 && idx < screens.length - 1) {
          animateTo(idx + 1);
        } else if (g.dx > 50 && idx > 0) {
          animateTo(idx - 1);
        } else {
          Animated.spring(translateX, {
            toValue: -idx * width,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={{
        flex: 1,
        flexDirection: "row",
        width: width * screens.length,
        transform: [{ translateX }],
      }}
      {...panResponder.panHandlers}
    >
      {screens.map((Screen, i) => (
        <Animated.View key={i} style={{ width }}>
          <Screen
            onNext={i < screens.length - 1 ? goToNext : () => {}}
          />
        </Animated.View>
      ))}
    </Animated.View>
  );
}
