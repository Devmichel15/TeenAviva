import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';
import { EMOTIONAL_STATES } from '../../constants/emotionalStates';
import Chip from '../ui/Chip';

export default function EmotionalStateChips({ onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>como chegaste hoje?</Text>
      <View style={styles.chips}>
        {EMOTIONAL_STATES.map((state) => (
          <Chip
            key={state.label}
            label={state.label}
            onPress={() => onSelect(state.label)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  label: {
    fontSize: 8,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: 'rgba(163,177,138,0.55)',
    fontFamily: 'ManropeSemiBold',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 6,
  },
});
