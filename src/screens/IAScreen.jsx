import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Sparkles } from 'lucide-react-native';
import { colors } from '../constants/theme';
import useAuth from '../hooks/useAuth';
import { UserService } from '../services/firestore.service';
import useGuide from '../hooks/useGuide';
import MessageBubble from '../components/guide/MessageBubble';
import InputBar from '../components/guide/InputBar';
import TypingIndicator from '../components/guide/TypingIndicator';
import EmptyState from '../components/guide/EmptyState';
import ErrorBanner from '../components/guide/ErrorBanner';
import VerseContext from '../components/ia/VerseContext';
import FadeIn from '../components/ui/FadeIn';
import AnimatedPressable from '../components/ui/AnimatedPressable';

export default function IAScreen({ verse, emotionalState, onBack, prefill, prefillContext }) {
  const insets = useSafeAreaInsets();
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const listRef = useRef(null);
  const [initialized, setInitialized] = useState(false);

  const userName = userData?.name?.split(' ')[0] || '';

  useEffect(() => {
    const uid = authUser?.uid;
    if (!uid) return;
    const unsub = UserService.subscribe(uid, setUserData);
    return unsub;
  }, [authUser?.uid]);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    addWelcomeMessage,
    dismissError,
  } = useGuide(userName);

  useEffect(() => {
    if (!initialized) {
      if (!prefill) {
        addWelcomeMessage(verse);
      }
      setInitialized(true);
    }
  }, [initialized, verse, addWelcomeMessage, prefill]);

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading]);

  const handleSuggestion = (suggestion) => {
    sendMessage(suggestion);
  };

  const renderMessage = ({ item }) => (
    <MessageBubble message={item} onSuggestion={handleSuggestion} />
  );

  const renderFooter = () => {
    if (isLoading) {
      return (
        <View style={styles.typingWrap}>
          <TypingIndicator />
        </View>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        {onBack && (
          <AnimatedPressable onPress={onBack} scaleTo={0.9}>
            <View style={styles.backBtn}>
              <ChevronLeft size={18} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />
            </View>
          </AnimatedPressable>
        )}

        <View style={styles.headerCenter}>
          <View style={styles.headerDot} />
          <Text style={styles.headerTitle}>Guia Bíblico</Text>
        </View>

        <View style={styles.headerRight}>
          <Sparkles size={14} color={colors.sage} strokeWidth={1.5} />
        </View>
      </View>

      {verse && !prefillContext && <VerseContext verse={verse} />}

      {prefillContext && (
        <View style={styles.planContext}>
          <Text style={styles.planContextLabel}>PLANO DE LEITURA</Text>
          <Text style={styles.planContextTitle}>{prefillContext.planTitle}</Text>
          <Text style={styles.planContextDay}>{prefillContext.dayTitle}</Text>
        </View>
      )}

      <ErrorBanner message={error} onDismiss={dismissError} />

      <FlatList
        ref={listRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageContent}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!initialized ? <EmptyState /> : null}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      />

      <InputBar onSend={sendMessage} disabled={isLoading} initialText={prefill} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.white06,
    flexShrink: 0,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  headerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.sage,
  },
  headerTitle: {
    fontSize: 13,
    fontFamily: 'ManropeSemiBold',
    color: 'rgba(255,255,255,0.82)',
    letterSpacing: 0.3,
  },
  headerRight: {
    width: 32,
    alignItems: 'flex-end',
  },
  messageList: {
    flex: 1,
  },
  messageContent: {
    padding: 18,
    paddingBottom: 8,
  },
  typingWrap: {
    paddingLeft: 18,
    paddingBottom: 4,
  },
  planContext: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.sageBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.sageBorder,
  },
  planContextLabel: {
    fontSize: 8,
    fontFamily: 'ManropeSemiBold',
    color: colors.sage,
    letterSpacing: 2,
    marginBottom: 4,
  },
  planContextTitle: {
    fontSize: 12,
    fontFamily: 'ManropeSemiBold',
    color: 'rgba(255,255,255,0.8)',
  },
  planContextDay: {
    fontSize: 10,
    fontFamily: 'ManropeRegular',
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
});
