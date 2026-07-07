import { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Sparkles, Flame, User } from 'lucide-react-native';
import { colors } from '../../constants/theme';
import NavItem from './NavItem';

const TABS = [
  { key: 'home', label: 'Início', icon: Home },
  { key: 'ia', label: 'Guia', icon: Sparkles },
  { key: 'chama', label: 'Chama', icon: Flame },
  { key: 'perfil', label: 'Perfil', icon: User },
];

export default function Navbar({ activeTab, onTabPress }) {
  const insets = useSafeAreaInsets();
  const entryAnim = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(entryAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 14,
        stiffness: 120,
      }),
      Animated.spring(slideY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 14,
        stiffness: 120,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: insets.bottom + 16,
          opacity: entryAnim,
          transform: [{ translateY: slideY }],
        },
      ]}
    >
      {TABS.map((tab) => (
        <NavItem
          key={tab.key}
          icon={tab.icon}
          isActive={activeTab === tab.key}
          onPress={() => onTabPress(tab.key)}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 22,
    backgroundColor: colors.background,
    borderWidth: 3,
    borderColor: colors.brownDeep,
    shadowColor: colors.black,
    shadowOffset: { width: 5, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
});
