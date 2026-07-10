import { useState, useCallback, useRef } from 'react';
import { sendGuideMessage } from '../services/guide.service';

const WELCOME_SUGGESTIONS = [
  'O que é o Antigo Testamento?',
  'Quem foi Moisés?',
  'O que diz Génesis 1?',
];

export default function useGuide(userName = '') {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(false);
  const nameRef = useRef(userName);
  nameRef.current = userName;

  const addWelcomeMessage = useCallback((verse) => {
    const name = nameRef.current || '';
    const greeting = name ? `Olá, ${name}!` : 'Olá!';
    const welcomeMsg = {
      id: 'welcome-' + Date.now(),
      role: 'assistant',
      content: verse
        ? `${greeting} Sou o Guia Bíblico da TeenAviva. Posso explicar passagens, personagens, contextos históricos e muito mais sobre a Bíblia.\n\nVou-te ajudar a compreender melhor o que estás a ler. Escolhe uma sugestão ou escreve a tua pergunta.`
        : `${greeting} Sou o Guia Bíblico da TeenAviva.\n\nPosso ajudar-te a:\n• Explicar passagens bíblicas\n• Contextualizar livros e personagens\n• Entender o contexto histórico\n• Compreender palavras em hebraico e grego\n\nEscolhe uma sugestão ou escreve a tua pergunta.`,
      timestamp: new Date(),
      suggestions: WELCOME_SUGGESTIONS,
    };
    setMessages([welcomeMsg]);
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isLoading) return;

      abortRef.current = false;
      setError(null);

      const userMsg = {
        id: 'user-' + Date.now(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const historyForApi = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const responseText = await sendGuideMessage(historyForApi, nameRef.current);

        if (abortRef.current) return;

        const aiMsg = {
          id: 'ai-' + Date.now(),
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        if (abortRef.current) return;
        setError(err.message || 'Erro ao obter resposta. Tenta novamente.');

        const errorMsg = {
          id: 'error-' + Date.now(),
          role: 'assistant',
          content: 'Desculpa, ocorreu um erro ao processar a tua pergunta. Verifica a tua ligação à internet e tenta novamente.',
          timestamp: new Date(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    addWelcomeMessage,
    clearMessages,
    dismissError,
  };
}
