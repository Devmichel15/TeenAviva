import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { COLLECTIONS } from '../constants/collections';

function parseDoc(snap) {
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export const UserService = {
  async get(uid) {
    const snap = await getDoc(doc(db, COLLECTIONS.users, uid));
    return parseDoc(snap);
  },

  async create(uid, data) {
    await setDoc(doc(db, COLLECTIONS.users, uid), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async update(uid, data) {
    await updateDoc(doc(db, COLLECTIONS.users, uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  subscribe(uid, cb) {
    return onSnapshot(doc(db, COLLECTIONS.users, uid), (snap) => {
      cb(parseDoc(snap));
    });
  },
};

export const DailyVerseService = {
  async getToday() {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, COLLECTIONS.dailyVerse),
      where('date', '==', today),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  async getLatest() {
    const q = query(
      collection(db, COLLECTIONS.dailyVerse),
      orderBy('date', 'desc'),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  },
};

export const PlanService = {
  async getAll() {
    const snap = await getDocs(collection(db, COLLECTIONS.plans));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async getById(id) {
    const snap = await getDoc(doc(db, COLLECTIONS.plans, id));
    return parseDoc(snap);
  },
};

export const UserPlanService = {
  async getActive(uid) {
    const q = query(
      collection(db, COLLECTIONS.userPlans),
      where('userId', '==', uid),
      where('status', '==', 'active'),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  async getAll(uid) {
    const q = query(
      collection(db, COLLECTIONS.userPlans),
      where('userId', '==', uid)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async create(uid, planId, plan) {
    await setDoc(doc(collection(db, COLLECTIONS.userPlans)), {
      userId: uid,
      planId: plan.id,
      planTitle: plan.title,
      planDuration: plan.duration,
      planIcon: plan.icon,
      planIconColor: plan.iconColor,
      currentDay: 1,
      startedAt: serverTimestamp(),
      status: 'active',
      progress: 0,
      dailyLogs: [],
    });
  },

  async updateProgress(id, currentDay) {
    await updateDoc(doc(db, COLLECTIONS.userPlans, id), {
      currentDay,
      progress: currentDay,
      updatedAt: serverTimestamp(),
    });
  },

  subscribe(uid, cb) {
    const q = query(
      collection(db, COLLECTIONS.userPlans),
      where('userId', '==', uid)
    );
    return onSnapshot(q, (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  },
};

export const StreakService = {
  async get(uid) {
    const q = query(
      collection(db, COLLECTIONS.streaks),
      where('userId', '==', uid),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  subscribe(uid, cb) {
    const q = query(
      collection(db, COLLECTIONS.streaks),
      where('userId', '==', uid),
      limit(1)
    );
    return onSnapshot(q, (snap) => {
      if (snap.empty) {
        cb(null);
        return;
      }
      cb({ id: snap.docs[0].id, ...snap.docs[0].data() });
    });
  },
};

export const AchievementService = {
  async getAll() {
    const snap = await getDocs(collection(db, COLLECTIONS.achievements));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async getUserAchievements(uid) {
    const q = query(
      collection(db, COLLECTIONS.userAchievements),
      where('userId', '==', uid)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
};

export const NotificationService = {
  async updatePreferences(uid, prefs) {
    await updateDoc(doc(db, COLLECTIONS.users, uid), {
      notificationPreferences: prefs,
    });
  },
};

export const AIService = {
  async sendMessage(userId, verseId, message) {
    const response = await fetch(
      'https://us-central1-teenaviva-d3498.cloudfunctions.net/aiMeditation',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, verseId, message }),
      }
    );
    const data = await response.json();
    return data;
  },

  getMockResponse(userMessage, verseRef) {
    const responses = [
      {
        content:
          'É interessante que perguntas isso, porque no texto original grego esta palavra carrega um significado muito mais profundo. Vamos explorar juntos...',
        suggestions: [
          'O que significa no original?',
          'Como aplico isso hoje?',
          'Fala mais sobre o contexto',
        ],
      },
      {
        content:
          'Esta passagem foi escrita num contexto de desafio, tal como o que estás a viver. O autor estava a falar para pessoas que precisavam de ouvir exatamente o que tu precisas agora.',
        suggestions: [
          'Qual era o contexto histórico?',
          'Como posso confiar mais?',
          'Oração sobre isto',
        ],
      },
      {
        content:
          'O que Deus está a revelar aqui não é apenas informação — é transformação. Repara que a promessa vem antes da prova, não depois. Isso diz muito sobre o carácter de Deus.',
        suggestions: [
          'O que Deus quer me dizer?',
          'Como isso muda a minha perspetiva?',
          'Quero orar sobre isto',
        ],
      },
    ];
    const idx = Math.floor(Math.random() * responses.length);
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: responses[idx].content,
      timestamp: new Date(),
      suggestions: responses[idx].suggestions,
    };
  },
};
