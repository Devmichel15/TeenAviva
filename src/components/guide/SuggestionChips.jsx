import { View, StyleSheet } from 'react-native';
import Chip from '../ui/Chip';

export default function SuggestionChips({ suggestions, onPress }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <View style={styles.container}>
      {suggestions.map((s, i) => (
        <Chip
          key={i}
          label={s}
          variant="ai"
          onPress={() => onPress?.(s)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 8,
  },
});
