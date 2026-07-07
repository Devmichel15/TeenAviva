import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import auth from "../firebase/auth";
import { db } from "../firebase/config";
const errorsMap = {
  "auth/user-not-found": "Conta não encontrada",
  "auth/wrong-password": "Palavra-passe incorreta",
  "auth/invalid-credential": "Email ou palavra-passe inválidos",
  "auth/email-already-in-use": "Este email já está registado",
  "auth/invalid-email": "Email inválido",
  "auth/weak-password": "A palavra-passe deve ter pelo menos 8 caracteres",
  "auth/too-many-requests": "Demasiadas tentativas. Tenta novamente mais tarde",
  "auth/network-request-failed": "Erro de rede. Verifica a tua ligação",
  "auth/user-disabled": "Esta conta foi desativada",
  "auth/operation-not-allowed": "Operação não permitida",};

function translateError(error) {
  const msg = errorsMap[error.code] || "Ocorreu um erro. Tenta novamente";
  return { code: error.code, message: msg };
}

export async function login(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return { user: credential.user, error: null };
  } catch (error) {
    return { user: null, error: translateError(error) };
  }
}

export async function register({ name, email, password, age }) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", credential.user.uid), {
      name,
      email,
      age: Number(age),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      onboardingCompleted: false,
    });
    return { user: credential.user, error: null };
  } catch (error) {
    return { user: null, error: translateError(error) };
  }
}

export async function logout() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: translateError(error) };
  }
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    return { error: translateError(error) };
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}
