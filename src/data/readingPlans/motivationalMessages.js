const MESSAGES = {
  short: [
    'Sentimos a tua falta. Que tal reacender hoje a tua Chama da Fé?',
    'A Palavra continua esperando por ti.',
    'Mesmo que tenhas parado, hoje é um ótimo dia para continuar.',
    'Deus não desistiu de ti. E tu?',
    'A tua Bíblia está aberta à tua espera.',
    'Cada dia é uma nova oportunidade para recomeçar.',
    'Não importa há quanto tempo, o importante é voltares.',
    'O melhor momento para recomeçar é agora.',
  ],
  medium: [
    'Que bom que voltaste! A tua Chama ainda brilha.',
    'A Palavra de Deus não volta vazia. Volta a ler hoje.',
    'Cada leitura é um passo mais perto de Deus.',
    'Não deixes a tua Chama apagar. Acende-a hoje.',
    'Deus está a esperar por ti de braços abertos.',
  ],
  active: [
    'Continua assim! A tua dedicação está a dar frutos.',
    'Mais um dia, mais uma bênção. Continua firme!',
    'Estás a construir um hábito que mudará a tua vida.',
    'A perseverança é a chave. Não pares agora!',
  ],
};

export function getRandomMessage(daysSinceLastRead) {
  if (daysSinceLastRead >= 5) {
    const list = MESSAGES.short;
    return list[Math.floor(Math.random() * list.length)];
  }
  if (daysSinceLastRead >= 2) {
    const list = MESSAGES.medium;
    return list[Math.floor(Math.random() * list.length)];
  }
  const list = MESSAGES.active;
  return list[Math.floor(Math.random() * list.length)];
}

export function shouldShowMotivation(daysSinceLastRead) {
  return daysSinceLastRead >= 2;
}
