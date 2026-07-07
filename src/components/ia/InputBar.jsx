import { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, borderRadius } from '../../constants/theme';
import AnimatedPressable from '../ui/AnimatedPressable';

export default function InputBar({
  onSend,
  placeholder = 'Continua a tua meditação...',
}) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.22)"
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <AnimatedPressable onPress={handleSend} scaleTo={0.9}>
          <View style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}>
            <Text style={styles.sendIcon}>↑</Text>
          </View>
        </AnimatedPressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.white06,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.input,
    paddingHorizontal: 15,
    paddingVertical: 9,
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'ManropeRegular',
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 14,
    color: colors.background,
    fontWeight: '600',
  },
});
