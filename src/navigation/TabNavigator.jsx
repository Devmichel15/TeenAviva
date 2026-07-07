import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Sparkles, Flame, User } from 'lucide-react-native';
import { colors } from '../constants/theme';
import AnimatedPressable from '../components/ui/AnimatedPressable';

const TABS = [
  { key: 'home', label: 'Início', icon: Home },
  { key: 'ia', label: 'Guia', icon: Sparkles },
  { key: 'chama', label: 'Chama', icon: Flame },
  { key: 'perfil', label: 'Perfil', icon: User },
];

export default function TabNavigator({ activeTab, onTabPress }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const Icon = tab.icon;
        return (
          <AnimatedPressable
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            scaleTo={0.92}
          >
            <View style={[styles.tab, isActive && styles.tabActive]}>
              <Icon size={18} color={isActive ? colors.gold : colors.sage} strokeWidth={1.5} />
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            </View>
          </AnimatedPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.white06,
    backgroundColor: colors.background,
    paddingTop: 8,
  },
  tab: {
    alignItems: 'center',
    gap: 3,
    opacity: 0.3,
  },
  tabActive: {
    opacity: 1,
  },
  label: {
    fontSize: 7,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
    fontFamily: 'ManropeSemiBold',
  },
  labelActive: {
    color: colors.sage,
  },
});
