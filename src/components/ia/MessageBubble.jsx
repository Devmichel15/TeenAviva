import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';
import FadeIn from '../ui/FadeIn';
import SuggestionChips from './SuggestionChips';

export default function MessageBubble({ message, onSuggestion }) {
  const isUser = message.role === 'user';

  return (
    <FadeIn delay={100}>
      <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
        {!isUser && (
          <View style={styles.aiSig}>
            <View style={styles.aiDot} />
            <Text style={styles.aiName}>guia</Text>
          </View>
        )}
        <View style={[isUser ? styles.userBubble : styles.aiBubble]}>
          <Text style={[isUser ? styles.userText : styles.aiText]}>
            {message.content}
          </Text>
        </View>
        {!isUser && message.suggestions && message.suggestions.length > 0 && (
          <SuggestionChips
            suggestions={message.suggestions}
            onPress={onSuggestion}
          />
        )}
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
    maxWidth: '92%',
  },
  aiSig: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  aiDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.sage,
  },
  aiName: {
    fontSize: 7,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.sage,
    fontFamily: 'ManropeSemiBold',
  },
  userBubble: {
    maxWidth: '82%',
    backgroundColor: 'rgba(140,94,60,0.32)',
    borderWidth: 1,
    borderColor: 'rgba(140,94,60,0.45)',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 9,
  },
  aiBubble: {},
  userText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 18,
    fontWeight: '300',
    fontFamily: 'ManropeLight',
  },
  aiText: {
    fontSize: 12,
    fontWeight: '200',
    color: 'rgba(255,255,255,0.80)',
    lineHeight: 21,
    fontStyle: 'italic',
    fontFamily: 'ManropeLight',
  },
});
