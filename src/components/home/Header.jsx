import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../constants/theme';
import StreakPill from '../ui/StreakPill';

function Logo() {
  return (
    <Svg width={18} height={16} viewBox="0 0 56 50" fill="none">
      <Path d="M28 0L0 50H10L28 14L46 50H56L28 0Z" fill={colors.primaryBrown} />
      <Path d="M28 14L18 50H38L28 14Z" fill={colors.background} />
    </Svg>
  );
}

export default function Header({ streak, onStreakPress }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <Logo />
        <Text style={styles.logoName}>TeenAviva</Text>
      </View>
      <StreakPill streak={streak} onPress={onStreakPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 30,
    flexShrink: 0,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoName: {
    fontSize: 12,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 2,
    fontFamily: 'ManropeLight',
  },
});
