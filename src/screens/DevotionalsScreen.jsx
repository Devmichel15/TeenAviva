import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, borderRadius } from "../constants/theme";
import { useDevotionals } from "../hooks/useDevotionals";

function RenderItem({ item }) {
  const createdAt = item.createdAt
    ? new Date(item.createdAt).toLocaleString("pt-PT", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.author}>{item.authorName}</Text>
          <Text style={styles.time}>{createdAt}</Text>
        </View>
      </View>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );
}

export default function DevotionalsScreen() {
  const { devotionals, loading, error, hasMore, loadMore, createDevotional } =
    useDevotionals();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => content.trim().length > 0 && content.trim().length <= 600,
    [content],
  );

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    const result = await createDevotional(content);
    setSubmitting(false);

    if (result.ok) {
      setContent("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Devocionais</Text>

      <View style={styles.formCard}>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Escreve um devocional..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          multiline
          maxLength={600}
          style={styles.input}
        />

        <View style={styles.footerRow}>
          <Text style={styles.counter}>{content.trim().length}/600</Text>
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit || submitting}
            style={[
              styles.submitBtn,
              (!canSubmit || submitting) && styles.submitBtnDisabled,
            ]}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={colors.background} />
            ) : (
              <Text style={styles.submitText}>Publicar</Text>
            )}
          </Pressable>
        </View>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading && devotionals.length === 0 ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.gold} />
        </View>
      ) : (
        <FlatList
          data={devotionals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasMore) loadMore();
          }}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.empty}>
                Ainda não há devocionais publicados.
              </Text>
            ) : null
          }
          renderItem={({ item }) => <RenderItem item={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    color: colors.white,
    fontFamily: "ManropeBold",
    marginBottom: 16,
  },
  formCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: borderRadius.card,
    padding: 12,
    marginBottom: 18,
  },
  input: {
    minHeight: 110,
    maxHeight: 180,
    color: colors.white,
    fontSize: 14,
    fontFamily: "ManropeRegular",
    textAlignVertical: "top",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  counter: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    fontFamily: "ManropeRegular",
  },
  submitBtn: {
    backgroundColor: colors.gold,
    borderRadius: borderRadius.button,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 92,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: colors.background,
    fontSize: 12,
    fontFamily: "ManropeSemiBold",
  },
  errorText: {
    color: "#ff8d8d",
    fontSize: 12,
    marginBottom: 12,
    fontFamily: "ManropeRegular",
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    borderRadius: borderRadius.card,
    padding: 14,
  },
  headerRow: {
    marginBottom: 8,
  },
  author: {
    color: colors.white,
    fontSize: 14,
    fontFamily: "ManropeSemiBold",
  },
  time: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 10,
    fontFamily: "ManropeRegular",
  },
  content: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "ManropeRegular",
  },
  empty: {
    color: "rgba(255,255,255,0.45)",
    textAlign: "center",
    marginTop: 24,
    fontFamily: "ManropeRegular",
  },
});
