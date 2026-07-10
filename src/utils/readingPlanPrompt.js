export function buildReadingPlanPrompt(planTitle, dayTitle, passages) {
  const readings = passages.join('\n');
  return `Acabei de concluir a leitura de hoje do plano "${planTitle}".

Dia: ${dayTitle}

Leituras:
${readings}

Gostaria que:
• explicasses o contexto histórico dessas passagens
• explicasses para quem foram escritas
• mostrasses o contexto cultural da época
• resumisses o ensinamento principal
• mostrasses como aplicar isso hoje
• apontasses conexões com outras passagens da Bíblia
• me fizesses algumas perguntas para refletirmos juntos sobre o que li`;
}
