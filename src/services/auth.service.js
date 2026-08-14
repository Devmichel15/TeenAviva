import { supabase } from "../supabase/client";

const errorsMap = {
  "Invalid login credentials":
    "Email ou palavra-passe inválidos",
  "Email not confirmed":
    "Email ainda não confirmado. Verifica a tua caixa de entrada.",
  "User already registered":
    "Este email já está registado",
  "User with this email has been registered":
    "Este email já está registado",
  "Password should be at least 6 characters":
    "A palavra-passe deve ter pelo menos 6 caracteres",
  "Password should be at least 8 characters":
    "A palavra-passe deve ter pelo menos 8 caracteres",
  "Password should not be one of the top 10 most common passwords":
    "Escolhe uma palavra-passe mais segura",
  "Email address is not valid":
    "Email inválido",
  "Unable to validate email address: invalid format":
    "Email inválido",
  "New password should be different from the old password":
    "A nova palavra-passe deve ser diferente da anterior",
  "For security purposes, you can only request this after 60 seconds.":
    "Aguarda um momento antes de tentar novamente.",
  "Too many requests":
    "Demasiadas tentativas. Tenta novamente mais tarde",
  "Rate limit exceeded":
    "Demasiadas tentativas. Tenta novamente mais tarde",
  "Network request failed":
    "Erro de rede. Verifica a tua ligação",
  "fetch failed":
    "Erro de rede. Verifica a tua ligação",
};

function translateError(error) {
  if (!error) {
    return { code: "unknown", message: "Ocorreu um erro. Tenta novamente" };
  }

  const raw =
    error.message ||
    error.error_description ||
    "Ocorreu um erro. Tenta novamente";

  const message = errorsMap[raw] || raw;
  return { code: error.code || error.status || "unknown", message };
}

export async function login(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { user: null, error: translateError(error) };
    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error: translateError(error) };
  }
}

export async function register({ name, email, password }) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) return { user: null, error: translateError(error) };

    if (!data.session) {
      return {
        user: null,
        error: {
          code: "email-not-confirmed",
          message:
            "Conta criada. Verifica o teu email para confirmar o registo antes de iniciar sessão.",
        },
      };
    }

    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error: translateError(error) };
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { error: translateError(error) };
    return { error: null };
  } catch (error) {
    return { error: translateError(error) };
  }
}

export async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { error: translateError(error) };
    return { error: null };
  } catch (error) {
    return { error: translateError(error) };
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
}
