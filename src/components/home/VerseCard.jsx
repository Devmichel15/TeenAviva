import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../constants/theme';
import AnimatedPressable from '../ui/AnimatedPressable';
import FadeIn from '../ui/FadeIn';

function VerseCardLoading() {
  return (
    <FadeIn delay={100}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>versículo do dia</Text>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: '60%' }]} />
        <View style={[styles.skeletonLine, { width: '30%', marginTop: 10 }]} />
      </View>
    </FadeIn>
  );
}

function VerseCardError({ onRetry }) {
  return (
    <FadeIn>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>versículo do dia</Text>
        <Text style={styles.errorText}>Não foi possível carregar o versículo.</Text>
        {onRetry && (
          <AnimatedPressable onPress={onRetry} scaleTo={0.95}>
            <View style={styles.retryBtn}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </View>
          </AnimatedPressable>
        )}
      </View>
    </FadeIn>
  );
}

export default function VerseCard({ verse, loading, error, onRetry, onPress }) {
  if (loading) return <VerseCardLoading />;
  if (error) return <VerseCardError onRetry={onRetry} />;
  if (!verse) return null;

  return (
    <FadeIn delay={100}>
      <AnimatedPressable onPress={onPress}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>versículo do dia</Text>
          <Text style={styles.text}>
            "{verse.text}"
          </Text>
          <View style={styles.refRow}>
            <Text style={styles.ref}>{verse.reference}</Text>
            {verse.displayDate && (
              <Text style={styles.date}>{verse.displayDate}</Text>
            )}
          </View>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Meditar</Text>
            <Text style={styles.arrow}>→</Text>
          </View>
        </View>
      </AnimatedPressable>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.goldBg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: borderRadius.card,
    padding: 15,
    position: 'relative',
  },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: 'rgba(201,151,58,0.65)',
    marginBottom: 9,
    fontFamily: 'ManropeSemiBold',
  },
  text: {
    fontSize: 13,
    fontWeight: '200',
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 22,
    fontStyle: 'italic',
    fontFamily: 'ManropeLight',
    marginBottom: 8,
  },
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ref: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.28)',
    textTransform: 'uppercase',
    fontFamily: 'ManropeRegular',
  },
  date: {
    fontSize: 8,
    color: 'rgba(201,151,58,0.4)',
    fontFamily: 'ManropeLight',
  },
  button: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: 'rgba(163,177,138,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(163,177,138,0.3)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buttonText: {
    fontSize: 9,
    color: colors.sage,
    letterSpacing: 1,
    fontFamily: 'ManropeSemiBold',
  },
  arrow: {
    fontSize: 10,
    color: colors.sage,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: 'rgba(201,151,58,0.12)',
    borderRadius: 6,
    marginBottom: 8,
    width: '85%',
  },
  errorText: {
    fontSize: 11,
    color: 'rgba(255, 150, 150, 0.7)',
    fontFamily: 'ManropeLight',
    lineHeight: 18,
    marginBottom: 10,
  },
  retryBtn: {
    backgroundColor: 'rgba(163,177,138,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(163,177,138,0.25)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignSelf: 'flex-start',
  },
  retryText: {
    fontSize: 10,
    color: colors.sage,
    fontFamily: 'ManropeSemiBold',
    letterSpacing: 0.5,
  },
});
