import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export default function VerseContext({ verse }) {
  if (!verse) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>meditando em</Text>
      <Text style={styles.verse}>
        "{verse.text}" · {verse.reference}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    marginVertical: 10,
    backgroundColor: 'rgba(201,151,58,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(201,151,58,0.18)',
    borderRadius: 14,
    padding: 10,
  },
  label: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(201,151,58,0.55)',
    marginBottom: 4,
    fontFamily: 'ManropeSemiBold',
  },
  verse: {
    fontSize: 11,
    fontWeight: '200',
    color: 'rgba(255,255,255,0.65)',
    fontStyle: 'italic',
    lineHeight: 17,
    fontFamily: 'ManropeLight',
  },
});
