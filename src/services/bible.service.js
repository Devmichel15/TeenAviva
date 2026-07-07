import DAILY_VERSES from '../data/dailyVerses';

const BIBLE_API_BASE = 'https://bible-api.com';

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function stripAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalizeReference(ref) {
  const portugueseToEnglish = {
    'Salmos': 'Psalms',
    'Proverbios': 'Proverbs',
    'Eclesiastes': 'Ecclesiastes',
    'Isaias': 'Isaiah',
    'Jeremias': 'Jeremiah',
    'Lamentacoes': 'Lamentations',
    'Ezequiel': 'Ezekiel',
    'Daniel': 'Daniel',
    'Oseias': 'Hosea',
    'Joel': 'Joel',
    'Amos': 'Amos',
    'Obadias': 'Obadiah',
    'Jonas': 'Jonah',
    'Miqueias': 'Micah',
    'Naum': 'Nahum',
    'Habacuque': 'Habakkuk',
    'Sofonias': 'Zephaniah',
    'Ageu': 'Haggai',
    'Zacarias': 'Zechariah',
    'Malaquias': 'Malachi',
    'Mateus': 'Matthew',
    'Marcos': 'Mark',
    'Lucas': 'Luke',
    'Joao': 'John',
    'Atos': 'Acts',
    'Romanos': 'Romans',
    'Corintios': 'Corinthians',
    'Galatas': 'Galatians',
    'Efesios': 'Ephesians',
    'Filipenses': 'Philippians',
    'Colossenses': 'Colossians',
    'Tessalonicenses': 'Thessalonians',
    'Timoteo': 'Timothy',
    'Tito': 'Titus',
    'Filemom': 'Philemon',
    'Hebreus': 'Hebrews',
    'Tiago': 'James',
    'Pedro': 'Peter',
    'Judas': 'Jude',
    'Apocalipse': 'Revelation',
    'Genesis': 'Genesis',
    'Exodo': 'Exodus',
    'Levitico': 'Leviticus',
    'Numeros': 'Numbers',
    'Deuteronomio': 'Deuteronomy',
    'Josue': 'Joshua',
    'Juizes': 'Judges',
    'Rute': 'Ruth',
    'Samuel': 'Samuel',
    'Reis': 'Kings',
    'Cronicas': 'Chronicles',
    'Esdras': 'Ezra',
    'Neemias': 'Nehemiah',
    'Ester': 'Esther',
    'Jo': 'Job',
  };

  // Strip accents to match both "Gálatas" and "Galatas"
  const normalized = stripAccents(ref);

  for (const [pt, en] of Object.entries(portugueseToEnglish)) {
    const idx = normalized.indexOf(pt);
    if (idx !== -1) {
      const before = normalized.slice(0, idx);
      const after = normalized.slice(idx + pt.length);
      return before + en + after;
    }
  }

  return normalized;
}

function formatDateBR(date) {
  const day = date.getDate();
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return `${day} de ${months[date.getMonth()]}`;
}

export async function fetchDailyVerse() {
  const today = new Date();
  const dayIndex = getDayOfYear(today) % DAILY_VERSES.length;
  const verseEntry = DAILY_VERSES[dayIndex];

  const englishRef = normalizeReference(verseEntry.reference);
  const apiUrl = `${BIBLE_API_BASE}/${encodeURIComponent(englishRef)}?translation=kjv`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error('Não foi possível obter o versículo. Verifica a tua ligação.');
  }

  const data = await response.json();

  if (!data.text || !data.reference) {
    throw new Error('Resposta inválida da API bíblica.');
  }

  return {
    reference: verseEntry.reference,
    text: data.text.trim(),
    englishReference: data.reference,
    date: today.toISOString().split('T')[0],
    displayDate: formatDateBR(today),
  };
}
