import { useState } from "react";
import { supabase } from "../supabase/client";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function validateAvatarFile(file) {
  if (!file) {
    return { valid: false, message: "Seleciona uma imagem válida." };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: "Só são permitidas imagens JPEG, PNG ou WebP.",
    };
  }

  if ((file.size || 0) > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: "A imagem deve ter no máximo 5MB.",
    };
  }

  return { valid: true };
}

export function useAvatarUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadAvatar = async (file) => {
    const validation = validateAvatarFile(file);

    if (!validation.valid) {
      setError(validation.message);
      return { ok: false, error: validation.message };
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Sessão expirada. Inicia sessão novamente.");
      }

      const extension =
        file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "jpg";
      const path = `avatars/${user.id}/avatar.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "0",
          onUploadProgress: (event) => {
            const current =
              (event.loaded / (event.total || event.loaded || 1)) * 100;
            setProgress(Math.min(100, Math.max(0, current)));
          },
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);
      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        throw new Error("Não foi possível obter a URL pública da imagem.");
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      return { ok: true, url: publicUrl };
    } catch (uploadError) {
      const message =
        uploadError?.message ||
        "Não foi possível carregar a foto. Tenta novamente.";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploading,
    progress,
    error,
    uploadAvatar,
  };
}
