import { useIdTokenAuthRequest } from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import { GOOGLE_CLIENT_ID } from "../constants/env";
import useAuth from "./useAuth";

export default function useGoogleAuth() {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [request, response, promptAsync] = useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    if (!response) return;

    if (response.type === "success") {
      setLoading(true);
      setError(null);

      loginWithGoogle(response.params.id_token).then((res) => {
        setLoading(false);
        if (res.error) {
          setError(res.error.message);
        }
      });
    }

    if (response.type === "error") {
      setError("Login cancelado");
    }
  }, [response]);

  async function promptGoogleLogin() {
    setError(null);
    await promptAsync({ useProxy: false });
  }

  return {
    promptGoogleLogin,
    googleLoading: loading,
    googleDisabled: !request,
    googleError: error,
    clearGoogleError: () => setError(null),
  };
}
