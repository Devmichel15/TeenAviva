import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import auth from "../firebase/auth";

const errorsMap = {
  "auth/user-not-found": "Conta não encontrada",
  "auth/wrong-password": "Palavra-passe incorreta",
  "auth/invalid-credential": "Email ou palavra-passe inválidos",
  "auth/email-already-in-use": "Este email já está registado",
  "auth/invalid-email": "Email inválido",
  "auth/weak-password": "Password deve ter pelo menos 6 caracteres",
  "auth/too-many-requests": "Demasiadas tentativas. Tenta novamente mais tarde",
  "auth/network-request-failed": "Erro de rede. Verifica a tua ligação",
};

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

export async function register(email, password) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
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

export async function loginWithGoogle(idToken) {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);
    return { user: result.user, error: null };
  } catch (error) {
    if (error.code === "auth/cancelled-popup-request" || error.code === "auth/popup-closed-by-user") {
      return { user: null, error: { code: "sign_in_cancelled", message: "Login cancelado" } };
    }
    return { user: null, error: translateError(error) };
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}
