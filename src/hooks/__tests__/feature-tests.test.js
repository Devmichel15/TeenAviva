import {
  applyOptimisticDevotional,
  normalizeDevotional,
  rollbackOptimisticDevotional,
} from "../useDevotionals";
import { validateAvatarFile } from "../useAvatarUpload";

describe("useDevotionals helpers", () => {
  it("prepends optimistic item and keeps existing entries", () => {
    const optimistic = {
      id: "optimistic-1",
      content: "Novo devocional",
      createdAt: "2026-08-14T00:00:00.000Z",
      optimistic: true,
    };

    const result = applyOptimisticDevotional(
      [
        { id: "a", content: "Antigo" },
        { id: "b", content: "Outro" },
      ],
      optimistic,
    );

    expect(result[0]).toEqual(optimistic);
    expect(result).toHaveLength(3);
  });

  it("removes the optimistic item on rollback", () => {
    const list = [
      { id: "optimistic-1", content: "Novo devocional" },
      { id: "a", content: "Antigo" },
    ];

    const result = rollbackOptimisticDevotional(list, "optimistic-1");

    expect(result).toEqual([{ id: "a", content: "Antigo" }]);
  });

  it("normalizes the relational payload from Supabase", () => {
    const data = {
      id: "dev-1",
      author_id: "user-1",
      content: "Mensagem de fé",
      created_at: "2026-08-14T00:00:00.000Z",
      updated_at: "2026-08-14T00:00:00.000Z",
      profiles: { name: "Ana", avatar_url: "https://cdn.test/avatar.png" },
    };

    expect(normalizeDevotional(data)).toMatchObject({
      id: "dev-1",
      authorId: "user-1",
      content: "Mensagem de fé",
      authorName: "Ana",
      avatarUrl: "https://cdn.test/avatar.png",
    });
  });
});

describe("useAvatarUpload validation", () => {
  it("rejects invalid image types", () => {
    const result = validateAvatarFile({ type: "image/gif", size: 512 });

    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/JPEG|PNG|WebP/);
  });

  it("rejects files larger than 5MB", () => {
    const result = validateAvatarFile({
      type: "image/png",
      size: 6 * 1024 * 1024,
    });

    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/5MB|5 MB|máximo/i);
  });

  it("accepts a valid avatar file", () => {
    const result = validateAvatarFile({ type: "image/jpeg", size: 1024 });

    expect(result.valid).toBe(true);
  });
});
