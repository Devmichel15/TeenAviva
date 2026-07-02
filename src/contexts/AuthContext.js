import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import auth from "../firebase/auth";
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  resetPassword as resetPasswordService,
  loginWithGoogle as loginWithGoogleService,
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

  async function register(email, password) {
    return registerService(email, password);
  }

  async function logout() {
    return logoutService();
  }

  async function resetPassword(email) {
    return resetPasswordService(email);
  }

  async function loginWithGoogle(idToken) {
    return loginWithGoogleService(idToken);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, resetPassword, loginWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
}
