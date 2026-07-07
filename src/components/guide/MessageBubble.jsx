import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { colors } from '../../constants/theme';
import FadeIn from '../ui/FadeIn';
import MarkdownMessage from '../ui/MarkdownMessage';
import SuggestionChips from './SuggestionChips';

export default function MessageBubble({ message, onSuggestion }) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <FadeIn delay={80}>
      <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
        {!isUser && (
          <View style={styles.sig}>
            <View style={[styles.sigDot, isError && styles.sigDotError]} />
            <Text style={[styles.sigName, isError && styles.sigNameError]}>
              {isError ? 'erro' : 'guia'}
            </Text>
          </View>
        )}

        {isUser ? (
          <View style={styles.userBubble}>
            <Text style={styles.userText}>{message.content}</Text>
          </View>
        ) : (
          <View style={[styles.aiBubble, isError && styles.aiBubbleError]}>
            {isError && (
              <View style={styles.errorIconRow}>
                <AlertCircle size={13} color="rgba(255,150,150,0.7)" />
              </View>
            )}
            {isError ? (
              <Text style={[styles.aiText, styles.aiTextError]}>
                {message.content}
              </Text>
            ) : (
              <MarkdownMessage content={message.content} />
            )}
          </View>
        )}

        {!isUser && !isError && message.suggestions && message.suggestions.length > 0 && (
          <SuggestionChips suggestions={message.suggestions} onPress={onSuggestion} />
        )}
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
    maxWidth: '90%',
  },
  sig: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  sigDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.sage,
  },
  sigDotError: {
    backgroundColor: 'rgba(201, 59, 59, 0.7)',
  },
  sigName: {
    fontSize: 7,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.sage,
    fontFamily: 'ManropeSemiBold',
  },
  sigNameError: {
    color: 'rgba(201, 59, 59, 0.7)',
  },
  userBubble: {
    maxWidth: '80%',
    backgroundColor: 'rgba(140, 94, 60, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(140, 94, 60, 0.42)',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },
  aiBubble: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  aiBubbleError: {
    backgroundColor: 'rgba(201, 59, 59, 0.08)',
    borderColor: 'rgba(201, 59, 59, 0.2)',
  },
  errorIconRow: {
    marginBottom: 4,
  },
  userText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 19,
    fontFamily: 'ManropeLight',
  },
  aiText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 22,
    fontFamily: 'ManropeLight',
  },
  aiTextError: {
    color: 'rgba(255, 150, 150, 0.8)',
  },
});
