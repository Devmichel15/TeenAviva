import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import auth from "../firebase/auth";
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  resetPassword as resetPasswordService,
<<<<<<< HEAD
=======
  loginWithGoogle as loginWithGoogleService,
>>>>>>> 99b8c04df4fe5bb22abd0185030e2cd0b3a1cdc1
} from "../services/auth.service";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function login(email, password) {
    return loginService(email, password);
  }

<<<<<<< HEAD
  async function register(userData) {
    return registerService(userData);
=======
  async function register(email, password) {
    return registerService(email, password);
>>>>>>> 99b8c04df4fe5bb22abd0185030e2cd0b3a1cdc1
  }

  async function logout() {
    return logoutService();
  }

  async function resetPassword(email) {
    return resetPasswordService(email);
  }

<<<<<<< HEAD
  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, resetPassword }}
=======
  async function loginWithGoogle(idToken) {
    return loginWithGoogleService(idToken);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, resetPassword, loginWithGoogle }}
>>>>>>> 99b8c04df4fe5bb22abd0185030e2cd0b3a1cdc1
    >
      {children}
    </AuthContext.Provider>
  );
}
