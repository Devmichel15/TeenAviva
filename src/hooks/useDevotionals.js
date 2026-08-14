import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../supabase/client";

async function withTimeout(
  promiseFactory,
  timeoutMs = 10000,
  label = "Supabase request",
) {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promiseFactory(), timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export function normalizeDevotional(row) {
  if (!row) return null;

  const author = row.profiles || row.profile || {};

  return {
    id: row.id,
    authorId: row.author_id,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorName: author.name || "TeenAviva",
    avatarUrl: author.avatar_url || null,
    optimistic: Boolean(row.__optimistic),
  };
}

export function applyOptimisticDevotional(list, optimistic) {
  return [optimistic, ...list.filter((item) => item.id !== optimistic.id)];
}

export function rollbackOptimisticDevotional(list, id) {
  return list.filter((item) => item.id !== id);
}

export function useDevotionals() {
  const [devotionals, setDevotionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef(null);
  const loadingRef = useRef(false);

  const fetchDevotionals = useCallback(async (replace = false) => {
    if (loadingRef.current && !replace) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("devotionals")
        .select(
          "id, content, author_id, created_at, updated_at, profiles!author_id(name, avatar_url)",
        )
        .order("created_at", { ascending: false })
        .limit(20);

      if (!replace && cursorRef.current) {
        query = query.lt("created_at", cursorRef.current);
      }

      const { data, error: fetchError } = await withTimeout(
        () => query,
        10000,
        "Supabase fetch devotionals",
      );

      if (fetchError) throw fetchError;

      const items = (data || []).map(normalizeDevotional);

      setDevotionals((current) => {
        if (replace) return items;
        const seen = new Set(current.map((item) => item.id));
        return [...current, ...items.filter((item) => !seen.has(item.id))];
      });

      setHasMore(items.length === 20);
      cursorRef.current = items.length
        ? items[items.length - 1].createdAt
        : null;
    } catch (fetchError) {
      setError("Não foi possível carregar os devocionais. Tenta novamente.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchDevotionals(false);
  }, [fetchDevotionals, hasMore, loading]);

  const createDevotional = useCallback(
    async (content) => {
      const trimmed = (content || "").trim();

      if (!trimmed) {
        setError("Escreve uma mensagem antes de publicar.");
        return { ok: false };
      }

      if (trimmed.length > 600) {
        setError("O devocional deve ter no máximo 600 caracteres.");
        return { ok: false };
      }

      const { data: authData, error: authError } = await withTimeout(
        () => supabase.auth.getUser(),
        10000,
        "Supabase getUser for devotional",
      );

      if (authError || !authData?.user) {
        setError("Sessão expirada. Inicia sessão novamente.");
        return { ok: false };
      }

      const optimistic = {
        id: `optimistic-${Date.now()}`,
        authorId: authData.user.id,
        content: trimmed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorName:
          authData.user.user_metadata?.name ||
          authData.user.email?.split("@")[0] ||
          "Tu",
        avatarUrl: null,
        optimistic: true,
      };

      setDevotionals((current) =>
        applyOptimisticDevotional(current, optimistic),
      );
      setError(null);

      try {
        const { data, error: insertError } = await withTimeout(
          () =>
            supabase
              .from("devotionals")
              .insert({
                author_id: authData.user.id,
                content: trimmed,
              })
              .select(
                "id, content, author_id, created_at, updated_at, profiles!author_id(name, avatar_url)",
              )
              .single(),
          10000,
          "Supabase insert devotional",
        );

        if (insertError) throw insertError;

        const saved = normalizeDevotional(data);
        setDevotionals((current) =>
          current.map((item) => (item.id === optimistic.id ? saved : item)),
        );
        cursorRef.current = null;
        await fetchDevotionals(true);

        return { ok: true, devotional: saved };
      } catch (insertError) {
        console.error("createDevotional failed:", insertError);
        setDevotionals((current) =>
          rollbackOptimisticDevotional(current, optimistic.id),
        );
        setError("Não foi possível publicar o devocional. Tenta novamente.");
        return { ok: false };
      }
    },
    [fetchDevotionals],
  );

  useEffect(() => {
    fetchDevotionals(true);
  }, [fetchDevotionals]);

  return {
    devotionals,
    loading,
    error,
    hasMore,
    loadMore,
    createDevotional,
    fetchDevotionals,
  };
}
