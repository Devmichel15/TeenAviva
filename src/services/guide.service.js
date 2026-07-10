import { GUIDE_CONFIG, getSystemPrompt } from '../config/guide.config';

const HF_API_URL = 'https://router.huggingface.co/v1/chat/completions';

export async function sendGuideMessage(messages, userName = 'utilizador') {
  const apiMessages = [
    { role: 'system', content: getSystemPrompt(userName) },
    ...messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
  ];

  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GUIDE_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GUIDE_CONFIG.model,
      messages: apiMessages,
      max_tokens: GUIDE_CONFIG.maxTokens,
      temperature: GUIDE_CONFIG.temperature,
      top_p: GUIDE_CONFIG.topP,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 503) {
      throw new Error('Modelo a carregar. Tenta novamente dentro de alguns segundos.');
    }
    if (response.status === 429) {
      throw new Error('Demasiados pedidos. Aguarda um momento e tenta novamente.');
    }
    throw new Error(
      errorData.error?.message || errorData.error || 'Erro ao conectar com o Guia Bíblico. Tenta novamente.'
    );
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || data.error);
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Resposta vazia. Tenta novamente.');
  }

  return content.trim();
}
