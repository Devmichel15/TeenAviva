import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../constants/theme";
import { useAvatarUpload } from "../../hooks/useAvatarUpload";

export default function AvatarPicker({ user, onAvatarUpdated }) {
  const { uploading, progress, error, uploadAvatar } = useAvatarUpload();
  const [localError, setLocalError] = useState("");
  const [previewUri, setPreviewUri] = useState(user?.avatarUrl || null);

  useEffect(() => {
    setPreviewUri(user?.avatarUrl || null);
  }, [user?.avatarUrl]);

  const handlePick = async () => {
    if (!user?.id) return;

    if (Platform.OS !== "web") {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setLocalError("Precisas permitir acesso à galeria para trocar a foto.");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    const file = {
      uri: asset.uri,
      name: `avatar-${Date.now()}.jpg`,
      type: asset.mimeType || "image/jpeg",
      size: asset.fileSize || 0,
    };

    const response = await uploadAvatar(file);

    if (response.ok) {
      setLocalError("");
      setPreviewUri(response.url);
      onAvatarUpdated?.(response.url);
      return;
    }

    setLocalError(
      response.error || "Não foi possível carregar a foto. Tenta novamente.",
    );
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePick} style={styles.avatarWrap}>
        {previewUri ? (
          <Image source={{ uri: previewUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>+</Text>
          </View>
        )}

        {uploading && (
          <View style={styles.overlay}>
            <ActivityIndicator color={colors.white} />
            <Text style={styles.progressText}>
              {Math.round(progress || 0)}%
            </Text>
          </View>
        )}
      </Pressable>

      {(error || localError) && (
        <Text style={styles.errorText}>{error || localError}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 12,
  },
  avatarWrap: {
    width: 84,
    height: 84,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.08)",
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 28,
    color: colors.white,
    fontFamily: "ManropeBold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.36)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    marginTop: 8,
    fontSize: 10,
    color: colors.white,
    fontFamily: "ManropeRegular",
  },
  errorText: {
    marginTop: 8,
    color: "#ff8d8d",
    fontSize: 11,
    textAlign: "center",
    fontFamily: "ManropeRegular",
  },
});
