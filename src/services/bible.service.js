import DAILY_VERSES from "../data/dailyVerses";

const BIBLE_API_BASE = "https://bible-api.com";
const FETCH_TIMEOUT = 8000;

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function stripAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeReference(ref) {
  const portugueseToEnglish = {
    Salmos: "Psalms",
    Proverbios: "Proverbs",
    Eclesiastes: "Ecclesiastes",
    Isaias: "Isaiah",
    Jeremias: "Jeremiah",
    Lamentacoes: "Lamentations",
    Ezequiel: "Ezekiel",
    Daniel: "Daniel",
    Oseias: "Hosea",
    Joel: "Joel",
    Amos: "Amos",
    Obadias: "Obadiah",
    Jonas: "Jonah",
    Miqueias: "Micah",
    Naum: "Nahum",
    Habacuque: "Habakkuk",
    Sofonias: "Zephaniah",
    Ageu: "Haggai",
    Zacarias: "Zechariah",
    Malaquias: "Malachi",
    Mateus: "Matthew",
    Marcos: "Mark",
    Lucas: "Luke",
    Joao: "John",
    Atos: "Acts",
    Romanos: "Romans",
    Corintios: "Corinthians",
    Galatas: "Galatians",
    Efesios: "Ephesians",
    Filipenses: "Philippians",
    Colossenses: "Colossians",
    Tessalonicenses: "Thessalonians",
    Timoteo: "Timothy",
    Tito: "Titus",
    Filemom: "Philemon",
    Hebreus: "Hebrews",
    Tiago: "James",
    Pedro: "Peter",
    Judas: "Jude",
    Apocalipse: "Revelation",
    Genesis: "Genesis",
    Exodo: "Exodus",
    Levitico: "Leviticus",
    Numeros: "Numbers",
    Deuteronomio: "Deuteronomy",
    Josue: "Joshua",
    Juizes: "Judges",
    Rute: "Ruth",
    Samuel: "Samuel",
    Reis: "Kings",
    Cronicas: "Chronicles",
    Esdras: "Ezra",
    Neemias: "Nehemiah",
    Ester: "Esther",
    Jo: "Job",
  };

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
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return `${day} de ${months[date.getMonth()]}`;
}

function fetchWithTimeout(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Pedido excedeu o tempo limite.")),
      timeoutMs,
    );

    fetch(url)
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function tryFetchVerseText(reference) {
  const englishRef = normalizeReference(reference);
  const encoded = englishRef
    .replace(/ /g, "%20")
    .replace(/:/g, "%3A");
  const apiUrl = `${BIBLE_API_BASE}/${encoded}?translation=almeida`;

  const response = await fetchWithTimeout(apiUrl, FETCH_TIMEOUT);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!data.text || !data.reference) {
    throw new Error("Resposta inválida da API bíblica.");
  }

  return data.text.trim();
}

export async function fetchDailyVerse() {
  const today = new Date();
  const dayIndex = getDayOfYear(today) % DAILY_VERSES.length;
  const verseEntry = DAILY_VERSES[dayIndex];

  const todayStr = today.toISOString().split("T")[0];
  const displayDate = formatDateBR(today);

  const base = {
    reference: verseEntry.reference,
    date: todayStr,
    displayDate,
  };

  try {
    const text = await tryFetchVerseText(verseEntry.reference);
    return { ...base, text };
  } catch (firstErr) {
    try {
      const text = await tryFetchVerseText(verseEntry.reference);
      return { ...base, text };
    } catch {
      return {
        ...base,
        text: `${verseEntry.reference} — toca para meditar`,
      };
    }
  }
}
