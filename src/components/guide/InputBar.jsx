import { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import { colors, borderRadius } from '../../constants/theme';
import AnimatedPressable from '../ui/AnimatedPressable';

export default function InputBar({ onSend, disabled, initialText }) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState(initialText || '');
  const inputRef = useRef(null);
  const prevInitialRef = useRef(initialText);

  if (initialText && initialText !== prevInitialRef.current) {
    prevInitialRef.current = initialText;
    setText(initialText);
  }

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    Keyboard.dismiss();
  }

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Pergunta ao Guia Bíblico..."
          placeholderTextColor="rgba(255,255,255,0.2)"
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          editable={!disabled}
          multiline
          maxLength={2000}
        />
        <AnimatedPressable onPress={handleSend} scaleTo={0.88}>
          <View style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}>
            <Send size={14} color={canSend ? colors.background : 'rgba(255,255,255,0.3)'} strokeWidth={2} />
          </View>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1.5,
    borderTopColor: colors.white06,
    flexShrink: 0,
  },
  container: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.input,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'ManropeRegular',
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.button,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
