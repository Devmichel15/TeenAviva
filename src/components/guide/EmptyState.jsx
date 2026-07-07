import { View, Text, StyleSheet } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { colors } from '../../constants/theme';
import FadeIn from '../ui/FadeIn';

export default function EmptyState() {
  return (
    <FadeIn>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <BookOpen size={28} color={colors.sage} strokeWidth={1.2} />
        </View>
        <Text style={styles.title}>Guia Bíblico</Text>
        <Text style={styles.subtitle}>
          Pergunta sobre personagens, passagens, contextos históricos e muito mais.
        </Text>
        <View style={styles.hints}>
          <View style={styles.hintItem}>
            <Text style={styles.hintDot}>•</Text>
            <Text style={styles.hintText}>Explica passagens bíblicas</Text>
          </View>
          <View style={styles.hintItem}>
            <Text style={styles.hintDot}>•</Text>
            <Text style={styles.hintText}>Contextualiza livros e autores</Text>
          </View>
          <View style={styles.hintItem}>
            <Text style={styles.hintDot}>•</Text>
            <Text style={styles.hintText}>Palavras em hebraico e grego</Text>
          </View>
        </View>
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(163, 177, 138, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(163, 177, 138, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'ManropeSemiBold',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'ManropeLight',
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  hints: {
    gap: 8,
    alignSelf: 'stretch',
    maxWidth: 240,
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hintDot: {
    fontSize: 6,
    color: colors.sage,
    fontFamily: 'ManropeSemiBold',
  },
  hintText: {
    fontSize: 11,
    fontFamily: 'ManropeLight',
    color: 'rgba(255,255,255,0.4)',
  },
});
